import {createClient, User} from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.toString();
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY.toString();
const supabase = createClient(supabaseUrl, supabaseKey);


export interface Feature {
    name: string;
    title: string;
    shortDescription: string;
    longDescription: string | undefined;
    svgPaths: string[];
}

export interface AdminAction {
    id: number;
    performed_at: Date;
    section: string;
    action: string;
    description: string;
    author: string;
}

export interface TeamMember {
    idName: string;
    name: string;
    description: string;
    imageUrl: string;
    instagramUrl: string,
    twitterUrl: string,
    flexUrl: string
}

let getFeaturesCache; // This results in each client only requesting the data once.
export const getFeatures = async (noCache?: boolean): Promise<Feature[]> => {
    if (getFeaturesCache != undefined && !noCache) return getFeaturesCache

    let {data, error} = await supabase
        .from('Feature')
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
        .from('Feature')
        .select('*')
        .eq('name', name)
        .single();

    if (error) throw error;

    return data;
}


export const addFeature = async (name: string, title: string, shortDescription: string, longDescription: string, svgPaths: string[]): Promise<Feature> => {
    const { data, error } = await supabase
        .from('Feature')
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
        .from('Feature')
        .update({ title: title, shortDescription: shortDescription, longDescription: longDescription, svgPaths: svgPaths })
        .eq('name', name)
        .single()

    if (error) throw error;

    await addAdminAction('Leistungen', 'update', `Die Leistung mit dem Namen "${name}" wurde bearbeitet.`);
    return data;
}

export const deleteFeature = async (name: string) => {
    const { data, error } = await supabase
        .from('Feature')
        .delete()
        .eq('name', name)
        .single()

    if (error) throw error;

    await addAdminAction('Leistungen', 'delete', `Die Leistung mit dem Namen "${name}" wurde gelöscht.`);
    return data;
}


let getTeamMembersCache; // This results in each client only requesting the data once.
export const getTeamMembers = async (noCache?: boolean): Promise<TeamMember[]> => {
    if (getTeamMembersCache != undefined && !noCache) return getTeamMembersCache

    let {data, error} = await supabase
        .from('TeamMember')
        .select('*')
        .order('name')

    if (error) throw error;
    else getTeamMembersCache = data;

    return data;
}


export const getTeamMember = async (idName: string, noCache?: boolean): Promise<TeamMember> => {
    let find; // Only if the team member can not be found in the cache, a new request is sent.
    if (!noCache && (find = (await getTeamMembers()).find(e => e.idName == idName)) != undefined) return find

    let {data, error} = await supabase
        .from('TeamMember')
        .select('*')
        .eq('idName', idName)
        .single();

    if (error) throw error;

    return data;
}


export const addTeamMember = async (idName: string, name: string, description: string, imageUrl: string, instagramUrl: string, twitterUrl: string, flexUrl: string): Promise<TeamMember> => {
    const { data, error } = await supabase
        .from('TeamMember')
        .insert([
            { idName: idName, name: name, description: description, imageUrl: imageUrl, instagramUrl: instagramUrl, twitterUrl: twitterUrl, flexUrl: flexUrl },
        ])
        .single()

    if (error) throw error;

    await addAdminAction('Team', 'insert', `Das Team Mitglied mit dem Namen "${idName}" wurde hinzugefügt.`);
    return data;
}

export const updateTeamMember = async (idName: string, name: string, description: string, imageUrl: string, instagramUrl: string, twitterUrl: string, flexUrl: string): Promise<TeamMember> => {
    const { data, error } = await supabase
        .from('TeamMember')
        .update({ name: name, description: description, imageUrl: imageUrl, instagramUrl: instagramUrl, twitterUrl: twitterUrl, flexUrl: flexUrl })
        .eq('idName', idName)
        .single()

    if (error) throw error;

    await addAdminAction('Team', 'update', `Das Team Mitglied mit dem Namen "${idName}" wurde bearbeitet.`);
    return data;
}

export const deleteTeamMember = async (idName: string) => {
    const { data, error } = await supabase
        .from('TeamMember')
        .delete()
        .eq('idName', idName)
        .single()

    if (error) throw error;

    await addAdminAction('Team', 'delete', `Das Team Mitglied mit dem Namen "${idName}" wurde gelöscht.`);
    return data;
}


export const getAdminActions = async (count: number): Promise<AdminAction[]> => {
    let { data, error } = await supabase
        .from('Admin-Action')
        .select('*')
        .order('performed_at', {ascending: false})
        .limit(count)

    if (error) throw error;

    data.forEach((a) => a.performed_at = new Date(a.performed_at));
    return data;
}

export const addAdminAction = async (section: string, action: string, description: string, author?: string) => {
    const { data, error } = await supabase
        .from('Admin-Action')
        .insert([
            { section: section, action: action, description: description, author: author || getUser().email },
        ])

    if (error) throw error

    return data
}

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
    const { publicURL, error } = supabase.storage.from(bucket).getPublicUrl(path)

    if (error) throw error;

    return publicURL;
}

export const signIn = async (email: string, password: string) => {
    let {user, error} = await supabase.auth.signIn({
        email: email,
        password: password
    })

    if (error) throw error;

    return user;
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

export const signOut = async () => {
    let { error } = await supabase.auth.signOut();

    if (error) throw error;
    else return true
}