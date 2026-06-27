# Corrections du Manuel d'utilisateur CdP CI — V2.06.2026

Ce document recense les corrections à apporter au manuel d'utilisateur ainsi que les points ouverts issus de la revue client, qui ne peuvent pas être appliqués directement au fichier PDF.

## Correction p.45 — Cartes de l'annuaire (commentaire mp8)

**Problème constaté.** Le manuel affirme que chaque carte de membre affiche systématiquement l'avatar, le nom, l'organisation, le titre professionnel, la région, le secteur et les domaines d'expertise. Or, après vérification dans le code de l'annuaire (`nodebb-plugin-cop-directory/templates/directory.tpl`), seuls l'avatar et le nom sont toujours présents. Tous les autres champs (organisation, titre professionnel, type d'organisation, région, secteur, domaines d'expertise et biographie professionnelle) sont conditionnels : ils n'apparaissent que si le membre a renseigné l'information correspondante dans son profil.

**Phrase de remplacement (à substituer à la phrase actuelle).**

> « Chaque carte présente l'avatar et le nom du membre, ainsi que l'organisation, le titre professionnel, la région, le secteur et les domaines d'expertise lorsque le membre a renseigné ces informations. Les champs non renseignés ne sont pas affichés sur la carte. »

## Ajout p.30 — Glossaire des termes techniques (commentaire AM4/AM5R4 ; LZ a répondu « I'll do it »)

Glossaire à insérer en p.30, prêt à l'emploi. Les définitions sont volontairement formulées en langage clair, à destination de professionnels des politiques publiques non spécialistes.

**Markdown**
: Langage de mise en forme simple qui permet de structurer un texte (titres, listes, liens, gras) à l'aide de caractères ordinaires, sans logiciel spécialisé. Utilisé dans la rédaction des messages et des sujets sur la plateforme.

**SMTP**
: Protocole standard d'envoi des courriers électroniques. C'est le service qui permet à la plateforme d'expédier ses e-mails (notifications, confirmations, résumés).

**Plugin (module d'extension)**
: Composant logiciel additionnel qui ajoute une fonctionnalité à la plateforme (par exemple l'annuaire des membres ou la bibliothèque de documents) sans modifier le cœur du système.

**Modération / File de modération**
: Processus de contrôle des contenus publiés. La file de modération regroupe les messages signalés ou en attente d'approbation, afin qu'un modérateur les valide, les rejette ou les édite.

**Cache (mise en cache)**
: Mécanisme qui conserve temporairement des données fréquemment consultées pour accélérer l'affichage des pages. Vider le cache force la plateforme à recalculer ces données.

**API**
: Interface de programmation permettant à deux logiciels d'échanger des données de façon automatique. Elle sert, par exemple, à connecter la plateforme à des services externes.

**LLM / IA générative**
: Grand modèle de langage (Large Language Model). Système d'intelligence artificielle capable de produire ou de résumer du texte en langage naturel. Il alimente les fonctionnalités d'assistance et de génération de contenu de la plateforme.

**Webhook**
: Notification automatique envoyée par la plateforme vers un autre service au moment où un événement se produit (par exemple une nouvelle inscription), afin de déclencher une action sans intervention manuelle.

**Avatar**
: Image ou photo représentant un membre, affichée à côté de son nom sur son profil et dans l'annuaire.

**Tag / Étiquette**
: Mot-clé attribué à un sujet ou à un document pour le classer et faciliter sa recherche par thème.

**Digest / Résumé par e-mail**
: Courrier électronique périodique (quotidien, hebdomadaire) regroupant l'activité récente de la plateforme, envoyé aux membres qui y sont abonnés.

**District**
: Découpage administratif territorial. Sur la plateforme, il sert à situer géographiquement les membres et à filtrer l'annuaire par zone.

## Élément ouvert p.47 — Modalité « Autre » pour le Type d'organisation (commentaire AM9)

**Pourquoi ce point n'est pas appliqué automatiquement.** Les options de la liste « Type d'organisation » ne sont pas codées en dur : elles sont configurées dans les paramètres des champs personnalisés (custom fields) de l'administration NodeBB et stockées en base de données. Or toute modification de la base de données partagée requiert l'accord explicite du client. La modalité « Autre » ne sera donc ajoutée qu'après validation.

**Étapes d'administration pour ajouter l'option « Autre » au champ `org_type`.**

1. Se connecter à l'interface d'administration avec un compte administrateur.
2. Aller dans **Admin → Manage → Users → Custom user fields** (Champs utilisateur personnalisés).
3. Repérer le champ dont la clé est `org_type` (« Type d'organisation ») et l'ouvrir en édition.
4. Vérifier que le type de champ est bien une liste de sélection (« select »).
5. Dans la liste des options, ajouter une nouvelle entrée dont la valeur visible est **Autre**.
6. Enregistrer le champ.
7. Reconstruire et redémarrer si nécessaire (`./nodebb build` puis `./nodebb restart`) pour s'assurer que la nouvelle option apparaît dans les formulaires et dans le filtre de l'annuaire.

**Recommandation.** Une fois l'option ajoutée et validée, mettre à jour la liste des modalités du « Type d'organisation » indiquée en p.47 du manuel pour y inclure « Autre ».

## Élément ouvert p.60 — Confirmation client (commentaire LZ13)

Le contenu du tableau des rôles et permissions (p.60) est conforme au fonctionnement de la plateforme : NodeBB prend bien en charge la désignation de modérateurs par catégorie. Toutefois, le commentaire LZ13 demande explicitement une confirmation du client sur ce tableau. Ce point est donc **en attente de validation client** ; aucune modification n'est requise tant que cette confirmation n'a pas été obtenue.
