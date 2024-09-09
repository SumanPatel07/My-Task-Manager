import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: 'dashboard',
        icon: 'fas fa-home', // Updated from 'fal' to 'fas'
        label: 'Dashboard'
    },
    {
        routeLink: 'products',
        icon: 'fas fa-box-open', // Updated from 'fal' to 'fas'
        label: 'Products',
        items: [
            // Nested items
        ]
    },
    {
        routeLink: 'statistics',
        icon: 'fas fa-chart-bar', // Updated from 'fal' to 'fas'
        label: 'Statistics'
    },
    {
        routeLink: 'coupens',
        icon: 'fas fa-tags', // Updated from 'fal' to 'fas'
        label: 'Coupens',
        items: [
            // Nested items
        ]
    },
    {
        routeLink: 'mood',
        icon: 'fas fa-file', // Updated from 'fal' to 'fas'
        label: 'Mood Today'
    },
    {
        routeLink: 'media',
        icon: 'fas fa-camera', // Updated from 'fal' to 'fas'
        label: 'Media'
    },
    {
        routeLink: 'settings',
        icon: 'fas fa-cog', // Updated from 'fal' to 'fas'
        label: 'Settings',
        expanded: true,
        items: [
            // Nested items
        ]
    },
];
