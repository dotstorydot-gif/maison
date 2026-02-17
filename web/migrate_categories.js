
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log("Starting migration...");

    // 1. Get existing categories
    const { data: categories, error: catError } = await supabase.from('categories').select('*');
    if (catError) {
        console.error("Error fetching categories:", catError);
        return;
    }

    const findCat = (name) => categories.find(c => c.name === name);

    const waxingCat = findCat('Waxing');
    const lashesBrowsCat = findCat('Eyelashes & Eyebrows');

    if (!waxingCat || !lashesBrowsCat) {
        console.log("Original categories not found or already migrated.");
    }

    // 2. Create new categories if they don't exist
    const newCatNames = ['Eyelashes', 'Eyebrows', 'Waxing Face', 'Waxing Body'];
    for (const name of newCatNames) {
        const existing = findCat(name);
        if (!existing) {
            console.log(`Creating category: ${name}`);
            const { data, error } = await supabase.from('categories').insert([{ name, icon_name: name.includes('Wax') ? 'Scissors' : 'Sparkles' }]).select();
            if (error) console.error(`Error creating ${name}:`, error);
            else categories.push(data[0]);
        }
    }

    // 3. Reassign services
    const { data: services, error: servError } = await supabase.from('services').select('*');
    if (servError) {
        console.error("Error fetching services:", servError);
        return;
    }

    const eyelashesCatObj = findCat('Eyelashes');
    const eyebrowsCatObj = findCat('Eyebrows');
    const waxingFaceCatObj = findCat('Waxing Face');
    const waxingBodyCatObj = findCat('Waxing Body');

    for (const service of services) {
        let newCategoryId = null;

        // Logic for Eyelashes & Eyebrows split
        if (service.category_id === lashesBrowsCat?.id) {
            if (service.name.toLowerCase().includes('lash')) {
                newCategoryId = eyelashesCatObj.id;
            } else if (service.name.toLowerCase().includes('brow')) {
                newCategoryId = eyebrowsCatObj.id;
            }
        }

        // Logic for Waxing split
        if (service.category_id === waxingCat?.id) {
            const faceServices = ['Eyebrow Wax', 'Chin Wax', 'Upper lip Wax', 'Side burn wax'];
            if (faceServices.includes(service.name)) {
                newCategoryId = waxingFaceCatObj.id;
            } else {
                newCategoryId = waxingBodyCatObj.id;
            }
        }

        if (newCategoryId) {
            console.log(`Reassigning service: ${service.name} to new category.`);
            const { error } = await supabase.from('services').update({ category_id: newCategoryId }).eq('id', service.id);
            if (error) console.error(`Error updating ${service.name}:`, error);
        }
    }

    // 4. Optionally delete old categories if empty (after verification)
    console.log("Migration complete. Please verify in the dashboard.");
}

migrate();
