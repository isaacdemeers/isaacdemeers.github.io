import { FolderOpen, SquareArrowRight, SquareLibrary } from 'lucide-react'

export const sideNavPages = {
    projects: [
        {
            title: "Pour Commencer",
            type: "start",
            icon: SquareArrowRight,
            pages: ["README"]
        },
        {
            title: "Portfolio Personnel",
            type: "lib",
            icon: SquareLibrary,
            pages: ["Projets Professionnels", "Projets Personnels"]
        },
        {
            title: "Portfolio de Compétences",
            type: "lib",
            icon: SquareLibrary,
            pages: ["3eme année", "2eme année", "1ere année"]
        }
    ]
}