import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SkillInfo from './SkillInfo';
import UserInfo from './UserInfo';
import Projects from './ProjectsView';
const drawerWidth = 240;
interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window?: () => Window;
}
enum ViewedPage {
    SKILLINFO = "Skill info",
    USERINFO = "User info",
    PROJECTS = "Projects"
}

export default function Home() {

    const [viewedPage, setViewedPage] = React.useState(ViewedPage.USERINFO);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);


    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Handle the drawer close event.
     * Set mobileOpen to false to close the drawer, and set isClosing to true.
     * The isClosing state is used to prevent the drawer from immediately opening again
     * when we click on a drawer item.
     */
    /*******  b37e0a12-8aed-4ea9-9eb3-f14c1446758f  *******/
    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };


    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };
    const currentViewedPage = function (page: ViewedPage) {
        switch (page) {
            case ViewedPage.SKILLINFO:
                return <SkillInfo />;
                break;
            case ViewedPage.USERINFO:
                return <UserInfo />;
            case ViewedPage.PROJECTS:
                return <Projects />
            default:
                break;
        }
    }
    const drawer = (
        <div>


            <List sx={{ alignSelf: "center", alignContent: "center", alignItems: "center" }}>

                <ListItem key={'Inbox'} disablePadding>
                    <ListItemButton selected={viewedPage === ViewedPage.USERINFO} onClick={() => {
                        handleDrawerClose();
                        return setViewedPage(ViewedPage.USERINFO);
                    }}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="User Info" />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'SkillInfo'} disablePadding>
                    <ListItemButton selected={viewedPage === ViewedPage.SKILLINFO} onClick={function () {
                        handleDrawerClose();
                        return setViewedPage(ViewedPage.SKILLINFO);
                    }}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Skills Info" />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'Projects'} disablePadding>
                    <ListItemButton selected={viewedPage === ViewedPage.PROJECTS} onClick={function () {
                        handleDrawerClose();
                        return setViewedPage(ViewedPage.PROJECTS);
                    }}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Projects" />
                    </ListItemButton>
                </ListItem>
            </List>

        </div>
    );
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {viewedPage}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true, // Better open performance on mobile.
                        },
                    }}
                >
                    <Box pt={10}>
                        {drawer}
                    </Box>
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    <Box pt={10}>
                        <Divider></Divider>
                        {drawer}
                    </Box>                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                {currentViewedPage(viewedPage)}

            </Box>
        </Box>

    );
}