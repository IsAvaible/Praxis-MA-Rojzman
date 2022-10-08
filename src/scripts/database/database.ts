import {createClient} from '@supabase/supabase-js'
import type {User} from '@supabase/gotrue-js';
import type {SearchOptions} from '@supabase/storage-js';
import {deleteImagesFromHTML, publicUrlToKey} from "./databaseHtmlImageTools";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.toString();
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY.toString();
const supabase = createClient(supabaseUrl, supabaseKey);


export type Feature = {
    name: string;
    title: string;
    shortDescription: string;
    longDescription: string | undefined;
    svgPaths: string[];
}

export type ShowcasedFeature = {
    name: string;
    setAt: Date;
}

export type AdminAction = {
    id: number;
    performedAt: Date;
    section: string;
    action: string;
    description: string;
    author: string;
}

export type TeamMember = {
    id: string;
    name: string;
    role: string;
    description: string;
    imageUrl: string;
    instagramUrl: string,
    twitterUrl: string,
    flexUrl: string
}

export type BlogEntry = {
    id: string;
    createdAt: Date;
    author: string;
    title: string;
    previewText: string;
    content: string;
    previewImageUrl: string;
}

export type OfficeHour = {
    weekday: number;
    timePeriods: TimePeriod[];
    comment: string;
}

export type TimePeriod = {
    id: number;
    startTime: Date;
    duration: number;
}


// >>> Feature <<<


let getFeaturesCache; // This results in each client only requesting the data once.
export const getFeatures = async (noCache?: boolean): Promise<Feature[]> => {
    if (getFeaturesCache != undefined && !noCache) return getFeaturesCache

    let {data, error} = await supabase
        .from<Feature>('Feature')
        .select('*')
        .order('title')

    if (error) throw error;
    else getFeaturesCache = data;

    return data;
}

export const getFeature = async (name: string, noCache?: boolean): Promise<Feature> => {
    let find; // Only if the feature can not be found in the cache, a new request is sent.
    if (!noCache && (find = (await getFeatures()).find(e => e.name == name)) != undefined) return find

    let {data, error} = await supabase
        .from<Feature>('Feature')
        .select('*')
        .eq('name', name)
        .single();

    if (error) throw error;

    return data;
}

export const addFeature = async (name: string, title: string, shortDescription: string, longDescription: string, svgPaths: string[]): Promise<Feature> => {
    const { data, error } = await supabase
        .from<Feature>('Feature')
        .insert([
            { name: name, title: title, shortDescription: shortDescription, longDescription: longDescription, svgPaths: svgPaths },
        ])
        .single()

    if (error) throw error;

    await addAdminAction('Leistungen', 'insert', `Die Leistung mit dem Namen "${name}" wurde hinzugefügt.`);
    return data;
}

export const updateFeature = async (name: string, title: string, shortDescription: string, longDescription: string, svgPaths: string[]): Promise<Feature> => {
    const { data, error } = await supabase
        .from<Feature>('Feature')
        .update({ title: title, shortDescription: shortDescription, longDescription: longDescription, svgPaths: svgPaths })
        .eq('name', name)
        .single()

    if (error) throw error;

    await addAdminAction('Leistungen', 'update', `Die Leistung mit dem Namen "${name}" wurde bearbeitet.`);
    return data;
}

export const deleteFeature = async (name: string) => {
    let feature = await getFeature(name, true);

    // Delete all images in the long description of the feature
    await deleteImagesFromHTML(feature.longDescription)

    const { data, error } = await supabase
        .from<Feature>('Feature')
        .delete()
        .eq('name', name)
        .single()

    if (error) throw error;

    await addAdminAction('Leistungen', 'delete', `Die Leistung mit dem Namen "${name}" wurde gelöscht.`);
    return data;
}


// >>> Showcased Feature <<<


let getShowcasedFeaturesCache;
export const getShowcasedFeatures = async (noCache?: boolean): Promise<ShowcasedFeature[]> => {
    if (getShowcasedFeaturesCache != undefined && !noCache) return getShowcasedFeaturesCache

    let {data, error} = await supabase
        .from<ShowcasedFeature>('Showcased-Feature')
        .select('*')
        .order('setAt', {ascending: false})

    if (error) throw error;

    data.map(e => e.setAt = new Date(e.setAt));
    getShowcasedFeaturesCache = data;

    return data;
}

export const addShowcasedFeature = async (name: string): Promise<ShowcasedFeature> => {
    const { data, error } = await supabase
        .from<ShowcasedFeature>('Showcased-Feature')
        .insert([
            { name: name },
        ])
        .single()

    if (error) throw error;

    data.setAt = new Date(data.setAt);

    await addAdminAction('Leistungen', 'insert', `Die Leistung mit dem Namen "${name}" wurde auf die Startseite gesetzt.`);
    return data;
}

export const deleteShowcasedFeature = async (name: string) => {
    const { data, error } = await supabase
        .from<ShowcasedFeature>('Showcased-Feature')
        .delete()
        .eq('name', name)
        .single()

    if (error) throw error;
    data.setAt = new Date(data.setAt);

    await addAdminAction('Leistungen', 'delete', `Die Leistung mit dem Namen "${name}" wurde von der Startseite entfernt.`);
    return data;
}


// >>> Blog-Entry <<<


let getBlogEntriesCache; // This results in each client only requesting the data once.
export const getBlogEntries = async (noCache?: boolean, count?: number): Promise<BlogEntry[]> => {
    if (typeof count === undefined) count = -1;
    if (getBlogEntriesCache != undefined && !noCache) return getBlogEntriesCache.limit(count)

    let {data, error} = await supabase
        .from<BlogEntry>('Blog-Entry')
        .select('*')
        .order('createdAt', {ascending: false})
        .limit(count)

    if (error) { throw error; }

    data.forEach((b) => b.createdAt = new Date(b.createdAt));
    if (count == -1) getBlogEntriesCache = data;

    return data;
}

export const getBlogEntry = async (id: string, noCache?: boolean): Promise<BlogEntry> => {
    let find; // Only if the feature can not be found in the cache, a new request is sent.
    if (!noCache && (find = (await getBlogEntries()).find(e => e.id == id)) != undefined) return find

    let {data, error} = await supabase
        .from<BlogEntry>('Blog-Entry')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    data.createdAt = new Date(data.createdAt);

    return data;
}

// Adds a new blog entry to the database.
export const addBlogEntry = async (id: string, author: string, title: string, previewText: string, content: string, previewImageUrl?: string): Promise<BlogEntry> => {
    const { data, error } = await supabase
        .from<BlogEntry>('Blog-Entry')
        .insert([
            { id: id, author: author, title: title, previewText: previewText, content: content, previewImageUrl: previewImageUrl },
        ])
        .single()

    if (error) throw error;

    await addAdminAction('Aktuelles', 'insert', `Der Blog Eintrag mit der id "${id}" wurde hinzugefügt.`);
    return data;
}

// Updates the blog entry with the given id.
export const updateBlogEntry = async (id: string, author: string, title: string, previewText: string, content: string, previewImageUrl?: string): Promise<BlogEntry> => {
    const { data, error } = await supabase
        .from<BlogEntry>('Blog-Entry')
        .update( { id: id, author: author, title: title, previewText: previewText, content: content, previewImageUrl: previewImageUrl })
        .eq('id', id)
        .single()

    if (error) throw error;

    await addAdminAction('Aktuelles', 'update', `Der Blog Eintrag mit der id "${id}" wurde bearbeitet.`);
    return data;
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
        .from<BlogEntry>('Blog-Entry')
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
        .from<TeamMember>('Team-Member')
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
        .from<TeamMember>('Team-Member')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    return data;
}

// Adds the team member to the database.
export const addTeamMember = async (id: string, name: string, role: string, description: string, imageUrl: string, instagramUrl: string, twitterUrl: string, flexUrl: string): Promise<TeamMember> => {
    const { data, error } = await supabase
        .from<TeamMember>('Team-Member')
        .insert([
            { id: id, name: name, role: role, description: description, imageUrl: imageUrl, instagramUrl: instagramUrl, twitterUrl: twitterUrl, flexUrl: flexUrl },
        ])
        .single()

    if (error) throw error;

    await addAdminAction('Team', 'insert', `Das Team Mitglied mit der ID "${id}" und dem Namen "${name}" wurde hinzugefügt.`);
    return data;
}

// Updates the team member with the given id.
export const updateTeamMember = async (id: string, name: string, role: string, description: string, imageUrl: string, instagramUrl: string, twitterUrl: string, flexUrl: string): Promise<TeamMember> => {
    const { data, error } = await supabase
        .from<TeamMember>('Team-Member')
        .update({ name: name, role: role, description: description, imageUrl: imageUrl, instagramUrl: instagramUrl, twitterUrl: twitterUrl, flexUrl: flexUrl })
        .eq('id', id)
        .single()

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
        .from<TeamMember>('Team-Member')
        .delete()
        .eq('id', id)
        .single()

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
        .from<TimePeriod>('Time-Period')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    dataToTimePeriod(data);
    return data;
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
        .single()

    if (error) throw error;

    dataToTimePeriod(data);
    return data;
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
        .single()

    if (error) throw error;

    dataToTimePeriod(data);
    return data;
}

/*
 * Delete the time period with the given id.
 * @param id The id of the time period.
 */
export const deleteTimePeriod = async (id: number) => {
    const { data, error } = await supabase
        .from<TimePeriod>('Time-Period')
        .delete()
        .eq('id', id)
        .single()

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
    data.startTime = new Date(Date.parse("1970-01-01T" + data.startTime.toString()));
    return data;
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
        .from<OfficeHour>('Office-Hour')
        .select('*')
        .order('weekday', {ascending: true});

    if (error) throw error;

    data = await Promise.all(data.map(formatDataToOfficeHour));
    getOfficeHoursCache = data;
    return data;
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
        .single()

    if (error) {
        //  If an error occurs, the time periods are deleted again.
        await Promise.all(timePeriodIds.map(async timePeriodId => deleteTimePeriod(timePeriodId)));
        throw error;
    }

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
        .single()

    if (error) throw error;

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


// >>> Admin-Action <<<


export const getAdminActions = async (count?: number): Promise<AdminAction[]> => {
    if (typeof count === undefined) count = -1;

    let { data, error } = await supabase
        .from<AdminAction>('Admin-Action')
        .select('*')
        .order('performedAt', {ascending: false})
        .limit(count)

    if (error) throw error;

    data.forEach((a) => a.performedAt = new Date(a.performedAt));
    return data;
}

export const addAdminAction = async (section: string, action: string, description: string, author?: string) => {
    const { data, error } = await supabase
        .from<AdminAction>('Admin-Action')
        .insert([
            { section: section, action: action, description: description, author: author || getUser().email },
        ])

    if (error) throw error

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
    const { publicURL, error } = supabase.storage.from(bucket).getPublicUrl(path);

    if (error) throw error;

    return publicURL;
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
    let {user, error} = await supabase.auth.signIn({
        email: email,
        password: password
    })

    if (error) throw error;

    return user;
}

export const signOut = async () => {
    let { error } = await supabase.auth.signOut();

    if (error) throw error;
    else return true
}

export const signUp = async (email: string, password: string) => {
    let { user, error } = await supabase.auth.signUp({
        email: email,
        password: password
    })

    if (error) throw error;
    return user;
}

export const getUser = (): User | null => {
    return supabase.auth.user();
}

