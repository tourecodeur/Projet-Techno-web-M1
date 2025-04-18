import { AnneeAcademique } from './annee-academique';
export interface Annonce {
    id?: number;
    titre: string;
    description: string;
    dateLimite: string;
    etat: string;
    auteur: string;
    contenu: string;
    imageAnnonce: string;
    // AnneeAcademiqueId: Number;
}

