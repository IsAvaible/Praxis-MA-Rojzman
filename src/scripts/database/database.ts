import {createClient} from '@supabase/supabase-js';
import type {Database} from './database.types';
import type {User} from '@supabase/gotrue-js';
import type {SearchOptions} from '@supabase/storage-js';
import type {JSONObject} from "../misc/jsonTypes";
import {deleteImagesFromHTML, publicUrlToKey} from "./databaseHtmlImageTools";
import {numberToWeekdayDE} from "../misc/dateFormat";
import {adminActionsChangeStore} from "../stores/adminActionsChangeStore";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.toString();
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY.toString();
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


// >>> Config <<<

let getConfigCache: ConfigEntry[];
export const getConfigEntries = async (noCache?: boolean): Promise<ConfigEntry[]> => {
    if (getConfigCache != undefined && !noCache) return getConfigCache;

    let {data, error} = await supabase
        .from('Config-Entry')
        .select('*');

    if (error) throw error;
    else getConfigCache = data;

    return data;
}


export const getConfigEntry = async (id: string, noCache?: boolean): Promise<ConfigEntry> => {
    let find; // Only if the config entry can not be found in the cache, a new request is sent.
    if (!noCache && (find = (await getConfigEntries()).find(e => e.id == id)) != undefined) return find

    let {data, error} = await supabase
        .from('Config-Entry')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    data = dataToConfigEntry(data);
    if (getConfigCache != undefined) {
        let index = getConfigCache.findIndex(e => e.id == id);
        if (index != -1) getConfigCache[index] = data;
    }

    return data;
}

export const addConfigEntry = async (id: string, data: JSONObject, customAdminActionMessage?: {section: string, description: string}): Promise<ConfigEntry> => {
    let {data: dbData, error} = await supabase
        .from('Config-Entry')
        .insert([{id: id, data: data}])
        .select()
        .single()


    if (error) throw error;

    dbData = dataToConfigEntry(dbData);
    if (getConfigCache != undefined) getConfigCache.push(dbData);
    else getConfigCache = [dbData];

    if (customAdminActionMessage == undefined) await addAdminAction('Config', 'insert', `Die Konfiguration mit der ID "${id}" wurde hinzugefügt.`);
    else await addAdminAction(customAdminActionMessage.section, 'insert', customAdminActionMessage.description);

    return dbData;
}

export const updateConfigEntry = async (id: string, data: JSONObject, customAdminActionMessage?: {section: string, description: string}): Promise<ConfigEntry> => {
    let {data: dbData, error} = await supabase
        .from('Config-Entry')
        .update({data: data, updatedAt: new Date().toISOString()})
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    if (getConfigCache != undefined) {
        let index = getConfigCache.findIndex(e => e.id == id);
        getConfigCache[index] = dbData;
    }

    if (customAdminActionMessage == undefined) await addAdminAction('Config', 'update', `Die Konfiguration mit der ID "${id}" wurde aktualisiert.`);
    else await addAdminAction(customAdminActionMessage.section, 'update', customAdminActionMessage.description);

    return dataToConfigEntry(dbData);
}

export const deleteConfigEntry = async (id: string, customAdminActionMessage?: {section: string, description: string}): Promise<ConfigEntry> => {
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

const dataToConfigEntry = (data): ConfigEntry => {
    data.updatedAt = new Date(Date.parse(data.updatedAt.toString()));
    return data;
}

// >>> Feature <<<


let getFeaturesCache;
export const getFeatures = async (noCache?: boolean): Promise<Feature[]> => {
    if (getFeaturesCache != undefined && !noCache) return getFeaturesCache

    let {data, error} = await supabase
        .from('Feature')
        .select('*')

    if (error) throw error;
    else getFeaturesCache = (data = data.sort((a,b)=>a.order<b.order?-1:1));

    return data;
}

export const getFeature = async (name: string, noCache?: boolean): Promise<Feature> => {
    let find; // Only if the feature can not be found in the cache, a new request is sent.
    if (!noCache && (find = (await getFeatures()).find(e => e.name == name)) != undefined) return find

    let {data, error} = await supabase
        .from('Feature')
        .select('*')
        .eq('name', name)
        .single();

    if (error) throw error;

    return data;
}

export const addFeature = async (name: string, title: string, shortDescription: string, longDescription: string, svgPaths: string[]): Promise<Feature> => {
    let order = (await getFeatures()).length;
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

export const updateFeature = async (name: string, title: string, shortDescription: string, longDescription: string, svgPaths: string[], order: number): Promise<Feature> => {
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


let getShowcasedFeaturesCache;
export const getShowcasedFeatures = async (noCache?: boolean): Promise<ShowcasedFeature[]> => {
    if (getShowcasedFeaturesCache != undefined && !noCache) return getShowcasedFeaturesCache

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


let getBlogEntriesCache; // This results in each client only requesting the data once.
export const getBlogEntries = async (noCache?: boolean, count?: number): Promise<BlogEntry[]> => {
    if (typeof count === undefined) count = -1;
    if (getBlogEntriesCache != undefined && !noCache) return getBlogEntriesCache.limit(count)

    let {data, error} = await supabase
        .from('Blog-Entry')
        .select('*')
        .order('createdAt', {ascending: false})
        .limit(count)

    if (error) { throw error; }

    const parsed = [...data].map(e => {return {...e, createdAt: new Date(e.createdAt)}})
    if (count == -1) getBlogEntriesCache = parsed;

    return parsed;
}

export const getBlogEntry = async (id: string, noCache?: boolean): Promise<BlogEntry> => {
    let find; // Only if the feature can not be found in the cache, a new request is sent.
    if (!noCache && (find = (await getBlogEntries()).find(e => e.id == id)) != undefined) return find

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
export const updateBlogEntry = async (id: string, author: string, title: string, previewText: string, content: string, previewImageUrl?: string): Promise<BlogEntry> => {
    const { data, error } = await supabase
        .from('Blog-Entry')
        .update( { id: id, author: author, title: title, previewText: previewText, content: content, previewImageUrl: previewImageUrl })
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
    let blogEntry = await getBlogEntry(id, true);

    // Delete all images in the content of the blog entry
    await deleteImagesFromHTML(blogEntry.content)

    // Deletes the preview image from the database
    let key = publicUrlToKey(blogEntry.previewImageUrl);
    await deleteFiles(key.bucket, [key.path.match(/(.*)\?t=.*/)[1]]);

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


let getTeamMembersCache; // This results in each client only requesting the data once.
// Get all team members. The noCache parameter is used to force a new request.
export const getTeamMembers = async (noCache?: boolean): Promise<TeamMember[]> => {
    if (getTeamMembersCache != undefined && !noCache) return getTeamMembersCache

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
    if (!noCache && (find = (await getTeamMembers()).find(e => e.id == id)) != undefined) return find

    let {data, error} = await supabase
        .from('Team-Member')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    return data;
}

// Adds the team member to the database.
export const addTeamMember = async (id: string, name: string, role: string, description: string, imageUrl: string, instagramUrl: string, twitterUrl: string, flexUrl: string): Promise<TeamMember> => {
    const { data, error } = await supabase
        .from('Team-Member')
        .insert([
            { id: id, name: name, role: role, description: description, imageUrl: imageUrl, instagramUrl: instagramUrl, twitterUrl: twitterUrl, flexUrl: flexUrl },
        ])
        .select()
        .single();

    if (error) throw error;

    await addAdminAction('Team', 'insert', `Das Team Mitglied mit der ID "${id}" und dem Namen "${name}" wurde hinzugefügt.`);
    return data;
}

// Updates the team member with the given id.
export const updateTeamMember = async (id: string, name: string, role: string, description: string, imageUrl: string, instagramUrl: string, twitterUrl: string, flexUrl: string): Promise<TeamMember> => {
    const { data, error } = await supabase
        .from('Team-Member')
        .update({ name: name, role: role, description: description, imageUrl: imageUrl, instagramUrl: instagramUrl, twitterUrl: twitterUrl, flexUrl: flexUrl })
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

/**
 * Get the time period with the given id.
 * @param id The id of the time period.
 */
export const getTimePeriod = async (id: number): Promise<TimePeriod> => {
    let {data, error} = await supabase
        .from('Time-Period')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    const parsed = dataToTimePeriod(data);
    return parsed;
}

/**
 * Adds a new time period to the database.
 * @param startTime The start time of the time period.
 * @param duration The duration of the time period.
 */
export const addTimePeriod = async (startTime: Date, duration: number): Promise<TimePeriod> => {
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
    if (getOfficeHoursCache && !noCache) return getOfficeHoursCache;

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


export const getBannerConfig = async (name: string): Promise<BannerConfig> => {
    let { data, error } = await supabase
        .from('Banner-Config')
        .select('*')
        .eq('name', name)
        .single()

    if (error) throw error;

    return formatDataToBannerConfig(data);
}

export const addBannerConfig = async (bannerConfig: BannerConfig): Promise<BannerConfig> => {
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


export const getAdminActions = async (count?: number): Promise<AdminAction[]> => {
    if (typeof count === undefined) count = -1;

    let { data, error } = await supabase
        .from('Admin-Action')
        .select('*')
        .order('performedAt', {ascending: false})
        .limit(count)

    if (error) throw error;

    const parsed= data.map((a) => {return {...a, performedAt: new Date(a.performedAt)}});
    return parsed;
}

export const addAdminAction = async (section: string, action: string, description: string, author?: string) => {
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


export const uploadFile = async (bucket: string, path: string, file) => {
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
    const { data, error } = await supabase.storage.from(bucket).remove(paths);

    if (error) throw error;

    return data;
}

export const getPublicFileUrl = async (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
}

/// Lists all the files within a bucket.
export const listFiles = async (bucket: string, path?: string, searchOptions?: SearchOptions) => {
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

    return user;
}

export const signOut = async () => {
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

export const getUser = async (): Promise<User | null> => {
    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (session) return session.user;
    else return null;
}

