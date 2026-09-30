# Mise en service du CMS

Le panneau d'administration est disponible à `/admin/`. Il utilise Decap CMS avec Decap Turbo pour l'authentification et l'accès au dépôt GitHub. Les enregistrements publiés modifient les fichiers du dépôt ; Vercel redéploie ensuite le site.

## Connexion initiale

1. Créer une organisation sur [Decap Turbo](https://turbo.decapcms.org/signup).
2. Dans **Git connection**, connecter GitHub et autoriser l'application Decap Turbo à accéder au dépôt `Adjaho-Samson/TRINAHOOK`.
3. Créer un site dans Decap Turbo avec le dépôt `Adjaho-Samson/TRINAHOOK`, la branche `main` et le chemin de configuration `admin/config.yml`.
4. Ajouter l'adresse publique complète du panneau dans **Admin interface URL(s)**, par exemple `https://votre-domaine.vercel.app/admin/`.
5. Copier le **Site ID** affiché dans Decap Turbo et remplacer `REMPLACER_PAR_L_ID_DECAP_TURBO` dans `admin/config.yml`.
6. Publier cette modification sur GitHub. Après le déploiement Vercel, ouvrir `/admin/` et se connecter avec le compte Decap Turbo autorisé sur ce site.

## Gestion du contenu

Dans **Créations**, le propriétaire peut ajouter, supprimer ou réordonner les fiches, changer les photos, les noms, les catégories et les descriptions, et choisir les quatre pièces mises en avant sur l'accueil. Dans **Textes du site**, il peut modifier les textes des deux pages et les étapes du savoir-faire.

Le CMS Turbo est actuellement en bêta et demande la création du compte, la connexion GitHub et le Site ID avant que la connexion fonctionne. Ne partagez jamais un jeton GitHub dans les fichiers du site.
