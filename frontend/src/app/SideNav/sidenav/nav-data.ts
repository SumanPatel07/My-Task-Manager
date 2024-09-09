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
            {
                routeLink: 'products/level1.1',
                label: 'Level 1.1',
                items: [
                    {
                        routeLink: 'products/level2.1',
                        label: 'Level 2.1',
                    },
                    {
                        routeLink: 'products/level2.2',
                        label: 'Level 2.2',
                        items: [
                            {
                                routeLink: 'products/level3.1',
                                label: 'Level 3.1'
                            },
                            {
                                routeLink: 'products/level3.2',
                                label: 'Level 3.2'
                            }
                        ]
                    }
                ]
            },
            {
                routeLink: 'products/level1.2',
                label: 'Level 1.2',
            }
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
            {
                routeLink: 'coupens/list',
                label: 'List Coupens'
            },
            {
                routeLink: 'coupens/create',
                label: 'Create Coupens'
            }
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
            {
                routeLink: 'settings/profile',
                label: 'Profile'
            },
            {
                routeLink: 'settings/customize',
                label: 'Customize'
            }
        ]
    },
];
