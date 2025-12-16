<script setup lang="ts">
import ContactForm from '@/components/ContactForm.vue';
import Accordion from '@/components/ui/Accordion.vue';
import Tabs from '@/components/ui/Tabs.vue';
import { ref, onMounted } from 'vue'

const faqItems = ref([])

onMounted(async () => {
    const res = await fetch('/mock-data.json')
    const data = await res.json()
    faqItems.value = data.faq
})

const tabs = [
    {
        label: 'Nos contacts',
        slot: 'contactsList'
    },
    {
        label: 'Formulaire de contact',
        component: ContactForm
    }
]

</script>

<template>

    <section class="about">
        <div class="chapter">
            <h2>À propos du projet</h2>
            <p>Bienvenue sur notre site — un agrégateur moderne d’événements en Belgique.</p>
            <p>Nous avons créé cette plateforme pour tous ceux qui souhaitent découvrir facilement des activités intéressantes, explorer de nouveaux lieux et rester informés des événements les plus marquants du pays.</p>
            <p>Notre service réunit des concerts, festivals, expositions, spectacles, séances de cinéma, foires, événements éducatifs, rencontres professionnelles, activités pour enfants et bien d’autres. Nous rassemblons toutes les informations dans un format pratique, afin que vous puissiez choisir rapidement ce qui vous convient — selon la catégorie, la date et le lieu.</p>
        </div>
        <div class="chapter">
            <h2>Notre mission</h2>
            <p>Notre objectif est de rapprocher les gens des événements. De rendre la vie culturelle et sociale en Belgique plus accessible, riche et bien organisée.</p>
            <p>Notre site est un espace qui réunit idées, créativité et émotions. Un lieu où chacun peut trouver quelque chose à vivre et à partager.</p>
        </div>
        <div class="chapter">
            <h2>Pour les utilisateurs</h2>
            <p>Nous voulons rendre la recherche d’événements simple et inspirante.</p>
            <p>Sur notre site, vous pouvez:</p>
            <ul>
                <li>consulter les événements actuels par thématique, date ou localisation</li>
                <li>utiliser la carte interactive pour trouver des activités près de chez vous</li>
                <li>recevoir des recommandations personnalisées</li>
                <li>ajouter des événements à vos favoris ;</li>
                <li>laisser des commentaires et lire l’avis d’autres utilisateurs</li>
                <li>explorer l’archive des événements passés et partager votre expérience.</li>
            </ul>
            <p>Nous construisons une communauté de personnes qui aiment la culture, le mouvement et les nouvelles impressions.</p>
        </div>
        <div class="chapter">
            <h2>Pour les organisateurs</h2>
            <p>Si vous organisez des événements, notre plateforme vous aidera à les rendre visibles.</p>
            <p>Vous pouvez:</p>
            <ul>
                <li>publier gratuitement vos événements</li>
                <li>bénéficier d’une promotion supplémentaire auprès d’un large public</li>
                <li>attirer de nouveaux participants</li>
                <li>interagir avec votre audience grâce aux commentaires et aux avis</li>
                <li>renforcer votre réputation grâce à l’engagement des utilisateurs</li>
            </ul>
            <p>Nous aidons les organisateurs à promouvoir leurs projets et à trouver leur public.</p>
        </div>
        
    </section>

    <section class="faq">

        <Accordion 
        :items="faqItems"
        :defaultOpenIndex="0"
        />

    </section>

    <section class="contacts">
        <div class="contacts-header">
            <h2>Contacts</h2>
            <p>Des questions ? N’hésitez pas à nous contacter, nous serons ravis d’y répondre.</p>
        </div>

        <div class="contacts-tabs">
            <Tabs :items="tabs">
                <template #contactsList>
                    <ul class="contacts-list">
                        <li>Rue Paul Pastur 2B, 7500</li>
                        <li>quoideneuf@gmail.com</li>
                        <li>+32 457 77 77 77</li>
                    </ul>
                </template>
            </Tabs>
        </div>

    </section>
</template>

<style scoped>
.about {
    margin-top: 90px;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.chapter {
    padding: 20px;
    /* border: 1px solid var(--color-text); */
    border-radius: 10px;
}

.chapter h2 {
    margin-bottom: 30px;
    text-transform: none;
}

.chapter p {
    margin-top: 10px;
}

.contacts {
    margin-top: 90px;
    padding: 0 20px;
}

.contacts-header {
    text-align: center;
}

.contacts-header p {
    margin-top: 20px;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
}

.contacts-tabs {
    margin-top: 40px;

}

.contacts-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 60px;
    padding: 0;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
}

</style>
