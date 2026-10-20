import {createClient} from '@supabase/supabase-js';
import type {Database} from './database.types';
import type {User} from '@supabase/gotrue-js';
import type {SearchOptions} from '@supabase/storage-js';
import type {JSONObject} from "../misc/jsonTypes";
import {deleteImagesFromHTML, publicUrlToKey} from "./databaseHtmlImageTools";
import {numberToWeekdayDE} from "../misc/dateFormat";
import {adminActionsChangeStore} from "../stores/adminActionsChangeStore";
import {get} from "svelte/store";
import {DEMO_USER, isDemoModeStore} from "../stores/demoModeStore";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co').toString();
const supabaseKey = (import.meta.env.VITE_SUPABASE_KEY || 'placeholder').toString();
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
// To regenerate the types, run the following command in the terminal:
// (supabase login)
// supabase gen types typescript --project-id=xybuosnwqiuotktydvik > src/scripts/database/database.types.ts

export type ConfigEntry = Database['public']['Tables']['Config-Entry']['Row'];

export type Feature = Database['public']['Tables']['Feature']['Row'];

export type ShowcasedFeature = Omit<Database['public']['Tables']['Showcased-Feature']['Row'], 'setAt'> & { setAt: Date };

export type TeamMember = Database['public']['Tables']['Team-Member']['Row'];

export type BlogEntry = Omit<Database['public']['Tables']['Blog-Entry']['Row'], 'createdAt'> & { createdAt: Date };

export type OfficeHour = {
    weekday: number;
    timePeriods: TimePeriod[];
    comment: string;
}

export type TimePeriod = Omit<Database['public']['Tables']['Time-Period']['Row'], 'startTime'> & { startTime: Date };

export type BannerConfig = Omit<Database['public']['Tables']['Banner-Config']['Row'], 'updatedAt' | 'activeUntil'> & { updatedAt: Date, activeUntil: Date };

export type AdminAction = Omit<Database['public']['Tables']['Admin-Action']['Row'], 'performedAt'> & { performedAt: Date };


/**
 * Checks whether the current operation should run in Demo (Sandbox) mode.
 * Any unauthenticated session is automatically treated as Demo mode to protect the database.
 */
const isDemoSession = async (): Promise<boolean> => {
    if (get(isDemoModeStore)) return true;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        isDemoModeStore.set(true);
        return true;
    }
    return false;
};


// >>> Config <<<

let getConfigCache: ConfigEntry[] = [];
let demoConfigMap = new Map<string, ConfigEntry>();

export const getConfigEntries = async (noCache?: boolean): Promise<ConfigEntry[]> => {
    if (getConfigCache != undefined && getConfigCache.length > 0 && (!noCache || get(isDemoModeStore))) return getConfigCache;

    let {data, error} = await supabase
        .from('Config-Entry')
        .select('*');

    data = data || [];

    if (error) throw error;
    else {
        getConfigCache = data.map(dataToConfigEntry);
        getConfigCache.forEach(entry => demoConfigMap.set(entry.id, entry));
    }

    return getConfigCache;
}


export const getConfigEntry = async (id: string, noCache?: boolean): Promise<ConfigEntry> => {
    if (get(isDemoModeStore) && demoConfigMap.has(id)) {
        return demoConfigMap.get(id)!;
    }

    let find; // Only if the config entry can not be found in the cache, a new request is sent.
    if (!noCache && !!(find = (await getConfigEntries()).find(e => e.id == id))) {
        return find;
    }

    let {data, error} = await supabase
        .from('Config-Entry')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    data = dataToConfigEntry(data);
    demoConfigMap.set(id, data);
    if (getConfigCache != undefined) {
        let index = getConfigCache.findIndex(e => e.id == id);
        if (index != -1) getConfigCache[index] = data;
        else getConfigCache.push(data);
    }

    return data;
}

export const addConfigEntry = async (id: string, data: JSONObject, customAdminActionMessage?: {section: string, description: string}): Promise<ConfigEntry> => {
    if (await isDemoSession()) {
        const entry: ConfigEntry = { id, data, updatedAt: new Date() as any };
        demoConfigMap.set(id, entry);
        if (getConfigCache != undefined) {
            const idx = getConfigCache.findIndex(e => e.id === id);
            if (idx !== -1) getConfigCache[idx] = entry;
            else getConfigCache.push(entry);
        } else {
            getConfigCache = [entry];
        }
        if (customAdminActionMessage == undefined) await addAdminAction('Config', 'insert', `Die Konfiguration mit der ID "${id}" wurde hinzugefügt.`);
        else await addAdminAction(customAdminActionMessage.section, 'insert', customAdminActionMessage.description);
        return entry;
    }

    let {data: dbData, error} = await supabase
        .from('Config-Entry')
        .insert([{id: id, data: data}])
        .select()
        .single()


    if (error) throw error;

    dbData = dataToConfigEntry(dbData!);
    demoConfigMap.set(id, dbData);
    if (getConfigCache != undefined) getConfigCache.push(dbData);
    else getConfigCache = [dbData];

    if (customAdminActionMessage == undefined) await addAdminAction('Config', 'insert', `Die Konfiguration mit der ID "${id}" wurde hinzugefügt.`);
    else await addAdminAction(customAdminActionMessage.section, 'insert', customAdminActionMessage.description);

    return dbData;
}

export const updateConfigEntry = async (id: string, data: JSONObject, customAdminActionMessage?: {section: string, description: string}): Promise<ConfigEntry> => {
    if (await isDemoSession()) {
        const entry: ConfigEntry = { id, data, updatedAt: new Date() as any };
        demoConfigMap.set(id, entry);
        if (getConfigCache != undefined) {
            let index = getConfigCache.findIndex(e => e.id == id);
            if (index !== -1) getConfigCache[index] = entry;
            else getConfigCache.push(entry);
        }
        if (customAdminActionMessage == undefined) await addAdminAction('Config', 'update', `Die Konfiguration mit der ID "${id}" wurde aktualisiert.`);
        else await addAdminAction(customAdminActionMessage.section, 'update', customAdminActionMessage.description);
        return entry;
    }

    let {data: dbData, error} = await supabase
        .from('Config-Entry')
        .update({data: data, updatedAt: new Date().toISOString()})
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    if (getConfigCache != undefined) {
        let index = getConfigCache.findIndex(e => e.id == id);
        getConfigCache[index] = dbData!;
    }

    if (customAdminActionMessage == undefined) await addAdminAction('Config', 'update', `Die Konfiguration mit der ID "${id}" wurde aktualisiert.`);
    else await addAdminAction(customAdminActionMessage.section, 'update', customAdminActionMessage.description);

    return dataToConfigEntry(dbData);
}

export const deleteConfigEntry = async (id: string, customAdminActionMessage?: {section: string, description: string}): Promise<ConfigEntry> => {
    if (await isDemoSession()) {
        const existing = demoConfigMap.get(id) || { id, data: {}, updatedAt: new Date() as any };
        demoConfigMap.delete(id);
        if (getConfigCache != undefined) {
            let index = getConfigCache.findIndex(e => e.id == id);
            if (index !== -1) getConfigCache.splice(index, 1);
        }
        if (customAdminActionMessage == undefined) await addAdminAction('Config', 'delete', `Die Konfiguration mit der ID "${id}" wurde gelöscht.`);
        else await addAdminAction(customAdminActionMessage.section, 'delete', customAdminActionMessage.description);
        return existing;
    }

    let {data: dbData, error} = await supabase
        .from('Config-Entry')
        .delete()
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    if (getConfigCache != undefined) {
        let index = getConfigCache.findIndex(e => e.id == id);
        getConfigCache.splice(index, 1);
    }

    if (customAdminActionMessage == undefined) await addAdminAction('Config', 'delete', `Die Konfiguration mit der ID "${id}" wurde gelöscht.`);
    else await addAdminAction(customAdminActionMessage.section, 'delete', customAdminActionMessage.description);

    return dataToConfigEntry(dbData);
}

const dataToConfigEntry = (data: ConfigEntry) => {
    data.updatedAt = new Date(Date.parse(data.updatedAt.toString())) as any;
    return data;
}

// >>> Feature <<<


let getFeaturesCache: Feature[];
export const getFeatures = async (noCache?: boolean): Promise<Feature[]> => {
    if (getFeaturesCache != undefined && (!noCache || get(isDemoModeStore))) return getFeaturesCache

    let {data, error} = await supabase
        .from('Feature')
        .select('*')

    if (error) throw error;
    else getFeaturesCache = (data = data.sort((a,b)=>a.order<b.order?-1:1));

    return data;
}

export const getFeature = async (name: string, noCache?: boolean): Promise<Feature> => {
    let find; // Only if the feature can not be found in the cache, a new request is sent.
    if ((!noCache || get(isDemoModeStore)) && (find = (await getFeatures()).find(e => e.name == name)) != undefined) return find

    let {data, error} = await supabase
        .from('Feature')
        .select('*')
        .eq('name', name)
        .single();

    if (error) throw error;

    return data;
}

export const addFeature = async (name: string, title: string, shortDescription: string, longDescription: string, svgPaths: string[]): Promise<Feature> => {
    let features = await getFeatures();
    let order = features.length;

    if (await isDemoSession()) {
        const newFeature: Feature = {
            name,
            title,
            shortDescription,
            longDescription,
            svgPaths,
            order
        };
        getFeaturesCache = [...features, newFeature].sort((a, b) => a.order < b.order ? -1 : 1);
        await addAdminAction('Leistungen', 'insert', `Die Leistung mit dem Namen "${name}" wurde hinzugefügt.`);
        return newFeature;
    }

    const { data, error } = await supabase
        .from('Feature')
        .insert([
            { name: name, title: title, shortDescription: shortDescription, longDescription: longDescription, svgPaths: svgPaths, order: order },
        ])
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('Leistungen', 'insert', `Die Leistung mit dem Namen "${name}" wurde hinzugefügt.`);
    return data;
}

export const updateFeature = async (name: string, title: string, shortDescription: string, longDescription: string, svgPaths: string[], order?: number): Promise<Feature> => {
    if (await isDemoSession()) {
        const features = await getFeatures();
        const existing = features.find(f => f.name === name);
        const updatedFeature: Feature = {
            name,
            title,
            shortDescription,
            longDescription,
            svgPaths,
            order: order !== undefined ? order : (existing?.order ?? features.length)
        };
        getFeaturesCache = features.map(f => f.name === name ? updatedFeature : f).sort((a, b) => a.order < b.order ? -1 : 1);
        await addAdminAction('Leistungen', 'update', `Die Leistung mit dem Namen "${name}" wurde bearbeitet.`);
        return updatedFeature;
    }

    const { data, error } = await supabase
        .from('Feature')
        .update({ title: title, shortDescription: shortDescription, longDescription: longDescription, svgPaths: svgPaths, order: order })
        .eq('name', name)
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('Leistungen', 'update', `Die Leistung mit dem Namen "${name}" wurde bearbeitet.`);
    return data;
}

export const updateFeatureOrder = async (name: string, order: number, shouldAddAdminAction?: boolean): Promise<Feature> => {
    if (await isDemoSession()) {
        const features = await getFeatures();
        let updated: Feature | undefined;
        getFeaturesCache = features.map(f => {
            if (f.name === name) {
                updated = { ...f, order };
                return updated;
            }
            return f;
        }).sort((a, b) => a.order < b.order ? -1 : 1);
        if (shouldAddAdminAction) await addAdminAction('Leistungen', 'update', `Die Ordnung der Leistung mit dem Namen "${name}" wurde geändert.`);
        return updated!;
    }

    const { data, error } = await supabase
        .from('Feature')
        .update({ order: order })
        .eq('name', name)
        .select()
        .single();

    if (error) throw error;

    if (shouldAddAdminAction) await addAdminAction('Leistungen', 'update', `Die Ordnung der Leistung mit dem Namen "${name}" wurde geändert.`);
    return data;
}

export const deleteFeature = async (name: string) => {
    if (await isDemoSession()) {
        const features = await getFeatures();
        const feature = features.find(f => f.name === name);
        getFeaturesCache = features
            .filter(f => f.name !== name)
            .sort((a, b) => a.order < b.order ? -1 : 1)
            .map((f, index) => ({ ...f, order: index }));
        if (getShowcasedFeaturesCache != undefined) {
            getShowcasedFeaturesCache = getShowcasedFeaturesCache.filter(f => f.name !== name);
        }
        await addAdminAction('Leistungen', 'delete', `Die Leistung mit dem Namen "${name}" wurde gelöscht.`);
        return feature;
    }

    let feature = await getFeature(name, true);

    // Delete all images in the long description of the feature
    await deleteImagesFromHTML(feature.longDescription)

    let { data, error } = await supabase
        .from('Feature')
        .delete()
        .eq('name', name)
        .select()
        .single();

    if (error) throw error;
    // Update the order of all subsequent features
    let features = await getFeatures(true);
    for (let i = feature.order + 1; i < features.length; i++) {
        await updateFeatureOrder(features[i].name, i - 1, false);
    }

    await addAdminAction('Leistungen', 'delete', `Die Leistung mit dem Namen "${name}" wurde gelöscht.`);
    return data;
}


// >>> Showcased Feature <<<


let getShowcasedFeaturesCache: ShowcasedFeature[];
export const getShowcasedFeatures = async (noCache?: boolean): Promise<ShowcasedFeature[]> => {
    if (getShowcasedFeaturesCache != undefined && (!noCache || get(isDemoModeStore))) return getShowcasedFeaturesCache

    const {data, error} = await supabase
        .from('Showcased-Feature')
        .select('*')
        .order('setAt', {ascending: false})

    if (error) throw error;

    const parsed = [...data].map(e => {return {...e, setAt: new Date(e.setAt)}});
    getShowcasedFeaturesCache = parsed;

    return parsed;
}

export const addShowcasedFeature = async (name: string): Promise<ShowcasedFeature> => {
    if (await isDemoSession()) {
        const showcased = await getShowcasedFeatures();
        const parsed: ShowcasedFeature = { name, setAt: new Date() };
        getShowcasedFeaturesCache = [parsed, ...showcased.filter(f => f.name !== name)];
        await addAdminAction('Leistungen', 'insert', `Die Leistung mit dem Namen "${name}" wurde auf die Startseite gesetzt.`);
        return parsed;
    }

    const { data, error } = await supabase
        .from('Showcased-Feature')
        .insert([
            { name: name },
        ])
        .select()
        .single();

    if (error) throw error;

    const parsed = {...data, setAt: new Date(data.setAt)};

    await addAdminAction('Leistungen', 'insert', `Die Leistung mit dem Namen "${name}" wurde auf die Startseite gesetzt.`);
    return parsed;
}

export const deleteShowcasedFeature = async (name: string) => {
    if (await isDemoSession()) {
        const showcased = await getShowcasedFeatures();
        const existing = showcased.find(f => f.name === name) || null;
        getShowcasedFeaturesCache = showcased.filter(f => f.name !== name);
        await addAdminAction('Leistungen', 'delete', `Die Leistung mit dem Namen "${name}" wurde von der Startseite entfernt.`);
        return existing;
    }

    const { data, error } = await supabase
        .from('Showcased-Feature')
        .delete()
        .eq('name', name)
        .select()
        .single()

    if (error) throw error;
    if (data === null) return data;

    const parsed = {...data, setAt: new Date(data.setAt)};

    await addAdminAction('Leistungen', 'delete', `Die Leistung mit dem Namen "${name}" wurde von der Startseite entfernt.`);
    return parsed;
}


// >>> Blog-Entry <<<


let getBlogEntriesCache: BlogEntry[]; // This results in each client only requesting the data once.
export const getBlogEntries = async (noCache?: boolean, count?: number): Promise<BlogEntry[]> => {
    if (getBlogEntriesCache != undefined && (!noCache || get(isDemoModeStore))) {
        return count !== undefined && count > 0 ? getBlogEntriesCache.slice(0, count) : getBlogEntriesCache;
    }

    let query = supabase
        .from('Blog-Entry')
        .select('*')
        .order('createdAt', {ascending: false});

    if (count !== undefined && count > 0) {
        query = query.limit(count);
    }

    let {data, error} = await query;

    if (error) { throw error; }

    const parsed = [...data].map(e => {return {...e, createdAt: new Date(e.createdAt)}})
    if (count === undefined || count <= 0) getBlogEntriesCache = parsed;

    return parsed;
}

export const getBlogEntry = async (id: string, noCache?: boolean): Promise<BlogEntry> => {
    let find; // Only if the feature can not be found in the cache, a new request is sent.
    if ((!noCache || get(isDemoModeStore)) && (find = (await getBlogEntries()).find(e => e.id == id)) != undefined) return find

    let {data, error} = await supabase
        .from('Blog-Entry')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    const parsed = {...data, createdAt: new Date(data.createdAt)};

    return parsed;
}

// Adds a new blog entry to the database.
export const addBlogEntry = async (id: string, authorID: string, title: string, previewText: string, content: string, previewImageUrl?: string): Promise<BlogEntry> => {
    if (await isDemoSession()) {
        const entries = await getBlogEntries();
        const newEntry: BlogEntry = {
            id,
            authorID,
            title,
            previewText,
            content,
            previewImageUrl: previewImageUrl || '',
            createdAt: new Date()
        };
        getBlogEntriesCache = [newEntry, ...entries];
        await addAdminAction('Aktuelles', 'insert', `Der Blog Eintrag mit der id "${id}" wurde hinzugefügt.`);
        return newEntry;
    }

    const { data, error } = await supabase
        .from('Blog-Entry')
        .insert([
            { id: id, authorID: authorID, title: title, previewText: previewText, content: content, previewImageUrl: previewImageUrl },
        ])
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('Aktuelles', 'insert', `Der Blog Eintrag mit der id "${id}" wurde hinzugefügt.`);
    const parsed = {...data, createdAt: new Date(data.createdAt)};

    return parsed;
}

// Updates the blog entry with the given id.
export const updateBlogEntry = async (id: string, authorID: string, title: string, previewText: string, content: string, previewImageUrl?: string): Promise<BlogEntry> => {
    if (await isDemoSession()) {
        const entries = await getBlogEntries();
        const existing = entries.find(e => e.id === id);
        const updatedEntry: BlogEntry = {
            id,
            authorID,
            title,
            previewText,
            content,
            previewImageUrl: previewImageUrl ?? existing?.previewImageUrl ?? '',
            createdAt: existing?.createdAt ?? new Date()
        };
        getBlogEntriesCache = entries.map(e => e.id === id ? updatedEntry : e);
        await addAdminAction('Aktuelles', 'update', `Der Blog Eintrag mit der id "${id}" wurde bearbeitet.`);
        return updatedEntry;
    }

    const { data, error } = await supabase
        .from('Blog-Entry')
        .update( { id: id, authorID: authorID, title: title, previewText: previewText, content: content, previewImageUrl: previewImageUrl })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('Aktuelles', 'update', `Der Blog Eintrag mit der id "${id}" wurde bearbeitet.`);
    const parsed = {...data, createdAt: new Date(data.createdAt)};

    return parsed;
}

// Deletes the blog entry with the given id.
export const deleteBlogEntry = async (id: string) => {
    if (await isDemoSession()) {
        const entries = await getBlogEntries();
        const existing = entries.find(e => e.id === id);
        getBlogEntriesCache = entries.filter(e => e.id !== id);
        await addAdminAction('Aktuelles', 'delete', `Der Blog Eintrag mit der id "${id}" wurde gelöscht.`);
        return existing;
    }

    let blogEntry = await getBlogEntry(id, true);

    // Delete all images in the content of the blog entry
    await deleteImagesFromHTML(blogEntry.content)

    // Deletes the preview image from the database
    let key = publicUrlToKey(blogEntry.previewImageUrl);
    if (key) {
        const match = key.path.match(/(.*)\?t=.*/);
        await deleteFiles(key.bucket, [match ? match[1] : key.path]);
    }

    const { data, error } = await supabase
        .from('Blog-Entry')
        .delete()
        .eq('id', id)
        .single()

    if (error) throw error;

    await addAdminAction('Aktuelles', 'delete', `Der Blog Eintrag mit der id "${id}" wurde gelöscht.`);
    return data;
}


// >>> Team-Member <<<


let getTeamMembersCache: TeamMember[]; // This results in each client only requesting the data once.
// Get all team members. The noCache parameter is used to force a new request.
export const getTeamMembers = async (noCache?: boolean): Promise<TeamMember[]> => {
    if (getTeamMembersCache != undefined && (!noCache || get(isDemoModeStore))) return getTeamMembersCache

    let {data, error} = await supabase
        .from('Team-Member')
        .select('*')
        .order('name')

    if (error) throw error;
    else getTeamMembersCache = data;

    return data;
}

// Select the team member with the given id. The noCache parameter can be used to force a new request.
export const getTeamMember = async (id: string, noCache?: boolean): Promise<TeamMember> => {
    let find; // Only if the team member can not be found in the cache, a new request is sent.
    if ((!noCache || get(isDemoModeStore)) && (find = (await getTeamMembers()).find(e => e.id == id)) != undefined) return find

    let {data, error} = await supabase
        .from('Team-Member')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    return data;
}

// Adds the team member to the database.
export const addTeamMember = async (id: string, name: string, role: string, description: string, imageUrl: string, instagramUrl: string, xUrl: string, flexUrl: string): Promise<TeamMember> => {
    if (await isDemoSession()) {
        const members = await getTeamMembers();
        const newMember: TeamMember = {
            id,
            name,
            role,
            description,
            imageUrl,
            instagramUrl: instagramUrl || null,
            twitterUrl: xUrl || null,
            flexUrl: flexUrl || null
        };
        getTeamMembersCache = [...members, newMember].sort((a, b) => a.name.localeCompare(b.name));
        await addAdminAction('Team', 'insert', `Das Team Mitglied mit der ID "${id}" und dem Namen "${name}" wurde hinzugefügt.`);
        return newMember;
    }

    const { data, error } = await supabase
        .from('Team-Member')
        .insert([
            { id: id, name: name, role: role, description: description, imageUrl: imageUrl, instagramUrl: instagramUrl, twitterUrl: xUrl, flexUrl: flexUrl },
        ])
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('Team', 'insert', `Das Team Mitglied mit der ID "${id}" und dem Namen "${name}" wurde hinzugefügt.`);
    return data;
}

// Updates the team member with the given id.
export const updateTeamMember = async (id: string, name: string, role: string, description: string, imageUrl: string, instagramUrl: string, xUrl: string, flexUrl: string): Promise<TeamMember> => {
    if (await isDemoSession()) {
        const members = await getTeamMembers();
        const updatedMember: TeamMember = {
            id,
            name,
            role,
            description,
            imageUrl,
            instagramUrl: instagramUrl || null,
            twitterUrl: xUrl || null,
            flexUrl: flexUrl || null
        };
        getTeamMembersCache = members.map(m => m.id === id ? updatedMember : m);
        await addAdminAction('Team', 'update', `Das Team Mitglied mit der ID "${id}" und dem Namen "${name}" wurde bearbeitet.`);
        return updatedMember;
    }

    const { data, error } = await supabase
        .from('Team-Member')
        .update({ name: name, role: role, description: description, imageUrl: imageUrl, instagramUrl: instagramUrl, twitterUrl: xUrl, flexUrl: flexUrl })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('Team', 'update', `Das Team Mitglied mit der ID "${id}" und dem Namen "${name}" wurde bearbeitet.`);
    return data;
}

/**
 * Deletes the team member with the given id.
 * @param id The id of the team member.
 */
export const deleteTeamMember = async (id: string) => {
    if (await isDemoSession()) {
        const members = await getTeamMembers();
        const existing = members.find(m => m.id === id);
        getTeamMembersCache = members.filter(m => m.id !== id);
        await addAdminAction('Team', 'delete', `Das Team Mitglied mit der ID "${id}" und dem Namen "${existing?.name || id}" wurde gelöscht.`);
        return existing;
    }

    const { data, error } = await supabase
        .from('Team-Member')
        .delete()
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('Team', 'delete', `Das Team Mitglied mit der ID "${id}" und dem Namen "${data.name}" wurde gelöscht.`);
    return data;
}


// >>> Time-Period <<<

let demoTimePeriodsMap = new Map<number, TimePeriod>();

/**
 * Get the time period with the given id.
 * @param id The id of the time period.
 */
export const getTimePeriod = async (id: number): Promise<TimePeriod> => {
    if (get(isDemoModeStore) && demoTimePeriodsMap.has(id)) {
        return demoTimePeriodsMap.get(id)!;
    }

    let {data, error} = await supabase
        .from('Time-Period')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    const parsed = dataToTimePeriod(data);
    demoTimePeriodsMap.set(id, parsed);
    return parsed;
}

/**
 * Adds a new time period to the database.
 * @param startTime The start time of the time period.
 * @param duration The duration of the time period.
 */
export const addTimePeriod = async (startTime: Date, duration: number): Promise<TimePeriod> => {
    if (await isDemoSession()) {
        const newTimePeriod: TimePeriod = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            startTime: new Date(startTime),
            duration
        };
        demoTimePeriodsMap.set(newTimePeriod.id, newTimePeriod);
        return newTimePeriod;
    }

    // Convert the date to a string in the format "HH:mm:ss" using the toLocaleTimeString function.
    let startTimeString = startTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const { data, error } = await supabase
        .from('Time-Period')
        .insert([
            { startTime: startTimeString, duration: duration },
        ])
        .select()
        .single();

    if (error) throw error;

    const parsed = dataToTimePeriod(data);
    return parsed;
}

/**
 * Updates the time period with the given id.
 * @param id The id of the time period.
 * @param startTime The new start time of the time period.
 * @param duration The new duration of the time period.
 */
export const updateTimePeriod = async (id: number, startTime: Date, duration: number): Promise<TimePeriod> => {
    if (await isDemoSession()) {
        const updated: TimePeriod = { id, startTime: new Date(startTime), duration };
        demoTimePeriodsMap.set(id, updated);
        if (getOfficeHoursCache) {
            getOfficeHoursCache = getOfficeHoursCache.map(oh => ({
                ...oh,
                timePeriods: oh.timePeriods.map(tp => tp.id === id ? updated : tp)
            }));
        }
        return updated;
    }

    // Convert the date to a string in the format "HH:mm:ss" using the toLocaleTimeString function.
    let startTimeString = startTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const { data, error } = await supabase
        .from('Time-Period')
        .update({ startTime: startTimeString, duration: duration })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    const parsed = dataToTimePeriod(data);
    return parsed;
}

/*
 * Delete the time period with the given id.
 * @param id The id of the time period.
 */
export const deleteTimePeriod = async (id: number) => {
    if (await isDemoSession()) {
        const existing = demoTimePeriodsMap.get(id);
        demoTimePeriodsMap.delete(id);
        return existing;
    }

    const { data, error } = await supabase
        .from('Time-Period')
        .delete()
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Calculates the end time given a start time and a duration.
 * @param startTime The start time.
 * @param duration The duration in minutes.
 */
export const calculateEndTime = (startTime: Date, duration: number): Date => {
    let endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);
    return endTime;
}

/**
 * Calculates the distance between two dates in minutes.
 * @param startTime
 * @param endTime
 */
export const calculateDateDistance = (startTime: Date, endTime: Date): number => {
    return Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);
}

/**
 * Converts a row (data) from the Time-Period table to a TimePeriod object, by converting the startTime string to a Date object.
 * @param data The row from the Time-Period table.
 */
const dataToTimePeriod = (data) => {
    const parsed = {...data, startTime: new Date(Date.parse("1970-01-01T" + data.startTime.toString()))};
    return parsed;
}

// >>> Office-Hour <<<

let getOfficeHoursCache: OfficeHour[] = null;
/**
 * Get all office hours.
 * @param noCache If true, the office hours will be reloaded from the database.
 */
export const getOfficeHours = async (noCache: boolean = false): Promise<OfficeHour[]> => {
    if (getOfficeHoursCache && (!noCache || get(isDemoModeStore))) return getOfficeHoursCache;

    let {data, error} = await supabase
        .from('Office-Hour')
        .select('*')
        .order('weekday', {ascending: true});

    if (error) throw error;

    const parsed = await Promise.all(data.map(formatDataToOfficeHour));
    getOfficeHoursCache = parsed;
    return parsed;
}


/**
 * Get the office hours on the given week day.
 * @param weekday The week day.
 */
export const getOfficeHourByWeekday = async (weekday: number): Promise<OfficeHour> => {
    if (get(isDemoModeStore)) {
        const all = await getOfficeHours();
        const found = all.find(oh => oh.weekday === weekday);
        if (found) {
            return {
                weekday: found.weekday,
                timePeriods: found.timePeriods.map(tp => ({ ...tp, startTime: new Date(tp.startTime) })),
                comment: found.comment
            };
        }
    }

    let { data, error } = await supabase
        .from('Office-Hour')
        .select('*')
        .eq('weekday', weekday)
        .single()

    if (error) throw error;

    return await formatDataToOfficeHour(data);
}

/**
 * Updates the office hours on the given week day.
 * @param weekday The week day.
 * @param timePeriods The time periods.
 * @param comment A comment field that can be used to annotate the data.
 */
export const updateOfficeHour = async (weekday: number, timePeriods: TimePeriod[], comment: string): Promise<OfficeHour> => {
    if (await isDemoSession()) {
        const all = await getOfficeHours();
        const updated: OfficeHour = {
            weekday,
            timePeriods: timePeriods.map(tp => ({ ...tp, startTime: new Date(tp.startTime) })),
            comment
        };
        getOfficeHoursCache = all.map(oh => oh.weekday === weekday ? updated : oh);
        await addAdminAction('OfficeHour', 'update', `Die Sprechzeiten am ${numberToWeekdayDE(weekday)} wurden bearbeitet.`);
        return updated;
    }

    // This uploads the time periods to the database and stores the ids in a list.
    let timePeriodIds = timePeriods.map(timePeriod => timePeriod.id)

    const { data, error } = await supabase
        .from('Office-Hour')
        .update({ timePeriodIds: timePeriodIds, comment: comment })
        .eq('weekday', weekday)
        .select()
        .single();

    if (error) {
        //  If an error occurs, the time periods are deleted again.
        await Promise.all(timePeriodIds.map(async timePeriodId => deleteTimePeriod(timePeriodId)));
        throw error;
    }

    await addAdminAction('OfficeHour', 'update', `Die Sprechzeiten am ${numberToWeekdayDE(weekday)} wurden bearbeitet.`);

    return await formatDataToOfficeHour(data);
}

/**
 * Updates the comment on the given week day.
 * @param weekday The week day.
 * @param comment The comment.
 */
export const updateOfficeHourComment = async (weekday: number, comment: string): Promise<OfficeHour> => {
    if (await isDemoSession()) {
        const all = await getOfficeHours();
        let updated: OfficeHour | undefined;
        getOfficeHoursCache = all.map(oh => {
            if (oh.weekday === weekday) {
                updated = { ...oh, comment };
                return updated;
            }
            return oh;
        });
        await addAdminAction('OfficeHour', 'delete', `Der Kommentar zur Sprechzeit am ${numberToWeekdayDE(weekday)} wurde bearbeitet.`);
        return updated!;
    }

    const { data, error } = await supabase
        .from('Office-Hour')
        .update({ comment: comment })
        .eq('weekday', weekday)
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('OfficeHour', 'delete', `Der Kommentar zur Sprechzeit am ${numberToWeekdayDE(weekday)} wurde bearbeitet.`);

    return await formatDataToOfficeHour(data);
}

/**
 * Formats a row from the table Office-Hour to an office hour object.
 * @param data The row from the table Office-Hour.
 */
const formatDataToOfficeHour = async (data: any): Promise<OfficeHour> => {
    return {
        weekday: data.weekday,
        timePeriods: await Promise.all(data.timePeriodIds.map(id => getTimePeriod(id))),
        comment: data.comment
    } as OfficeHour;
}

/**
 * Formats an office hour object to a row (data) for the table Office-Hour.
 * @param officeHour The office hour object.
 */
const formatOfficeHourToData = (officeHour: OfficeHour): any => {
    return {
        weekday: officeHour.weekday,
        timePeriodIds: officeHour.timePeriods.map(timePeriod => timePeriod.id),
        comment: officeHour.comment
    }
}


// >>> Banner-Config <<<

let demoBannerConfigsMap: Map<string, BannerConfig> | null = null;

const ensureBannerConfigsLoaded = async (): Promise<Map<string, BannerConfig>> => {
    if (demoBannerConfigsMap !== null) return demoBannerConfigsMap;
    const { data, error } = await supabase
        .from('Banner-Config')
        .select('*');
    if (error) throw error;
    demoBannerConfigsMap = new Map();
    for (const row of data || []) {
        const formatted = formatDataToBannerConfig(row);
        demoBannerConfigsMap.set(formatted.name, formatted);
    }
    return demoBannerConfigsMap;
};

export const getBannerConfigNames = async (): Promise<string[]> => {
    if (get(isDemoModeStore)) {
        const map = await ensureBannerConfigsLoaded();
        return Array.from(map.keys());
    }
    const { data, error } = await supabase
        .from('Banner-Config')
        .select('name');
    if (error) throw error;
    return data.map(entry => entry.name);
};

export const getBannerConfig = async (name: string): Promise<BannerConfig> => {
    if (get(isDemoModeStore)) {
        const map = await ensureBannerConfigsLoaded();
        if (map.has(name)) {
            return structuredClone(map.get(name)!);
        }
    }

    let { data, error } = await supabase
        .from('Banner-Config')
        .select('*')
        .eq('name', name)
        .single()

    if (error) throw error;

    const formatted = formatDataToBannerConfig(data);
    if (demoBannerConfigsMap) {
        demoBannerConfigsMap.set(formatted.name, formatted);
    }
    return formatted;
}

export const addBannerConfig = async (bannerConfig: BannerConfig): Promise<BannerConfig> => {
    if (await isDemoSession()) {
        const map = await ensureBannerConfigsLoaded();
        const formatted = formatDataToBannerConfig({ ...bannerConfig, updatedAt: new Date() });
        map.set(formatted.name, structuredClone(formatted));
        await addAdminAction('Banner', 'insert', `Das Banner Konfiguration mit dem Namen "${bannerConfig.name}" wurde hinzugefügt.`);
        return formatted;
    }

    const { data, error } = await supabase
        .from('Banner-Config')
        // @ts-ignore
        .insert([bannerConfig])
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('Banner', 'insert', `Das Banner Konfiguration mit dem Namen "${bannerConfig.name}" wurde hinzugefügt.`);

    return formatDataToBannerConfig(data);
}

export const updateBannerConfig = async (bannerConfig: BannerConfig): Promise<BannerConfig> => {
    if (await isDemoSession()) {
        const map = await ensureBannerConfigsLoaded();
        const formatted = formatDataToBannerConfig({ ...bannerConfig, updatedAt: new Date() });
        map.set(formatted.name, structuredClone(formatted));
        await addAdminAction('Banner', 'update', `Das Banner Konfiguration mit dem Namen "${bannerConfig.name}" wurde bearbeitet.`);
        return formatted;
    }

    const { data, error } = await supabase
        .from('Banner-Config')
        // @ts-ignore
        .update(bannerConfig)
        .eq('name', bannerConfig.name)
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('Banner', 'update', `Das Banner Konfiguration mit dem Namen "${bannerConfig.name}" wurde bearbeitet.`);

    return formatDataToBannerConfig(data);
}

export const deleteBannerConfig = async (name: string): Promise<BannerConfig> => {
    if (await isDemoSession()) {
        const map = await ensureBannerConfigsLoaded();
        const existing = map.get(name);
        map.delete(name);
        await addAdminAction('Banner', 'delete', `Das Banner Konfiguration mit dem Namen "${name}" wurde gelöscht.`);
        return existing!;
    }

    const { data, error } = await supabase
        .from('Banner-Config')
        .delete()
        .eq('name', name)
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('Banner', 'delete', `Das Banner Konfiguration mit dem Namen "${name}" wurde gelöscht.`);

    return formatDataToBannerConfig(data);
}

const formatDataToBannerConfig = (data): BannerConfig => {
    let copy = { ...data };
    copy.updatedAt = copy.updatedAt ? new Date(copy.updatedAt) : null;
    copy.activeUntil = copy.activeUntil ? new Date(copy.activeUntil) : null;
    return copy;
}


// >>> Admin-Action <<<

let getAdminActionsCache: AdminAction[] | null = null;

export const getAdminActions = async (count?: number): Promise<AdminAction[]> => {
    if (getAdminActionsCache !== null && get(isDemoModeStore)) {
        return count !== undefined && count > 0 ? getAdminActionsCache.slice(0, count) : getAdminActionsCache;
    }

    let query = supabase
        .from('Admin-Action')
        .select('*')
        .order('performedAt', {ascending: false});

    if (count !== undefined && count > 0 && !get(isDemoModeStore)) {
        query = query.limit(count);
    }

    let { data, error } = await query;

    if (error) throw error;

    const parsed = data.map((a) => {return {...a, performedAt: new Date(a.performedAt)}});
    if (get(isDemoModeStore) || count === undefined || count <= 0) {
        getAdminActionsCache = parsed;
    }
    return count !== undefined && count > 0 ? parsed.slice(0, count) : parsed;
}

export const addAdminAction = async (section: string, action: string, description: string, author?: string) => {
    if (await isDemoSession()) {
        if (getAdminActionsCache === null) {
            try {
                await getAdminActions();
            } catch {
                getAdminActionsCache = [];
            }
        }
        const newAction: AdminAction = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            section,
            action,
            description: `[Demo] ${description}`,
            author: author || DEMO_USER.email!,
            performedAt: new Date()
        };
        getAdminActionsCache = [newAction, ...(getAdminActionsCache || [])];
        adminActionsChangeStore.set(true);
        return [newAction];
    }

    const { data, error } = await supabase
        .from('Admin-Action')
        .insert([
            { section: section, action: action, description: description, author: author || (await getUser()).email },
        ])
        .select();

    if (error) throw error

    adminActionsChangeStore.set(true);

    return data
}


// >>> File Related <<<

let demoUploadedFiles = new Map<string, string>();

export const uploadFile = async (bucket: string, path: string, file) => {
    if (await isDemoSession()) {
        const blobUrl = URL.createObjectURL(file);
        demoUploadedFiles.set(`${bucket}/${path}`, blobUrl);
        return { path };
    }

    const { data, error } = await supabase.storage.from(bucket).upload(path, file)

    if (error) throw error;

    return data;
}

export const downloadFile = async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) throw error;

    return data;
}

export const deleteFiles = async (bucket: string, paths: string[]) => {
    if (await isDemoSession()) {
        for (const p of paths) {
            demoUploadedFiles.delete(`${bucket}/${p}`);
        }
        return [];
    }

    const { data, error } = await supabase.storage.from(bucket).remove(paths);

    if (error) throw error;

    return data;
}

export const getPublicFileUrl = async (bucket: string, path: string) => {
    if (demoUploadedFiles.has(`${bucket}/${path}`)) {
        return demoUploadedFiles.get(`${bucket}/${path}`)!;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
}

/// Lists all the files within a bucket.
export const listFiles = async (bucket: string, path?: string, searchOptions?: SearchOptions) => {
    if (await isDemoSession()) {
        return [];
    }

    const { data, error } = await supabase
        .storage
        .from(bucket)
        .list(path, searchOptions)

    if (error) throw error;

    return data;
}


// >>> User Authentication <<<


export const signIn = async (email: string, password: string) => {
    const {
        data: { user },
        error,
    } = await supabase
        .auth
        .signInWithPassword({ email, password })

    if (error) throw error;

    isDemoModeStore.set(false);
    return user;
}

export const signOut = async () => {
    isDemoModeStore.set(false);
    let { error } = await supabase.auth.signOut();

    if (error) throw error;
    else return true
}

export const signUp = async (email: string, password: string): Promise<User | null> => {
    let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    })

    if (error) throw error;
    return data.user;
}

export const getRealSessionUser = async (): Promise<User | null> => {
    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (session) return session.user;
    else return null;
}

export const getUser = async (): Promise<User | null> => {
    const realUser = await getRealSessionUser();
    if (realUser) return realUser;
    if (get(isDemoModeStore)) return DEMO_USER;
    return null;
}

export const getUserByID = async (id: string): Promise<(User & { name?: string }) | null> => {
    if (await isDemoSession()) {
        return { ...DEMO_USER, name: id === DEMO_USER.id ? 'Portfolio Gast (Demo)' : 'Praxis Admin' };
    }

    try {
        const { data, error } = await supabase.auth.admin.getUserById(id);
        if (error) throw error;
        return data.user;
    } catch {
        return { ...DEMO_USER, name: 'Praxis Admin' };
    }
}
