import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Grid, List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';

import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import RemoveIcon from '@mui/icons-material/Remove';

export default function SideBar() {
  const location = useLocation();
  const [openUser, setOpenUser] = React.useState(false);
  const [openProduct, setOpenProduct] = React.useState(false);
  const [openOrder, setOpenOrder] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (location.pathname === '/admin/all-users') {
      setOpenUser(true);
      setSelectedIndex(11);
    }
    if (location.pathname === '/admin/all-products') {
      setOpenProduct(true);
      setSelectedIndex(21);
    }
    if (location.pathname === '/admin/all-orders') {
      setOpenOrder(true);
      setSelectedIndex(31);
    }
  }, [location.pathname]);

  const handleClickHome = (index) => {
    if (openOrder || openUser || openProduct) {
      setOpenOrder(false);
      setOpenUser(false);
      setOpenProduct(false);
    }
    setSelectedIndex(index);
  };
  const handleClickUser = (index) => {
    setOpenUser(!openUser);
    if (openOrder || openProduct) {
      setOpenOrder(false);
      setOpenProduct(false);
    }
    setSelectedIndex(index);
  };
  const handleClickUserAll = (index) => {
    setSelectedIndex(index);
  };
  const handleClickUserUpdate = (index) => {
    setSelectedIndex(index);
  };

  const handleClickProduct = (index) => {
    setOpenProduct(!openProduct);
    if (openOrder || openUser) {
      setOpenOrder(false);
      setOpenUser(false);
    }
    setSelectedIndex(index);
  };
  const handleClickProductAll = (index) => {
    setSelectedIndex(index);
  };
  const handleClickProductUpdate = (index) => {
    setSelectedIndex(index);
  };

  const handleClickOrder = (index) => {
    setOpenOrder(!openOrder);
    if (openProduct || openUser) {
      setOpenProduct(false);
      setOpenUser(false);
    }
    setSelectedIndex(index);
  };

  const handleClickOrderAll = (index) => {
    setSelectedIndex(index);
  };
  const handleClickOrderUpdate = (index) => {
    setSelectedIndex(index);
  };

  return (
    <Grid item xs={12} md={3}>
      <List
        sx={{ width: '100%', maxWidth: 350, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader">
        <Link to="/admin">
          <ListItemButton selected={selectedIndex === 0} onClick={() => handleClickHome(0)}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </Link>

        <ListItemButton selected={selectedIndex === 1} onClick={() => handleClickUser(1)}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
          {openUser ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openUser} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link to="/admin/all-users">
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedIndex === 11}
                onClick={() => handleClickUserAll(11)}>
                <ListItemIcon>
                  <RemoveIcon />
                </ListItemIcon>
                <ListItemText primary="All users" />
              </ListItemButton>
            </Link>
            <Link to="/admin/add-user">
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedIndex === 12}
                onClick={() => handleClickUserUpdate(12)}>
                <ListItemIcon>
                  <RemoveIcon />
                </ListItemIcon>
                <ListItemText primary="Create user" />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>

        <ListItemButton selected={selectedIndex === 2} onClick={() => handleClickProduct(2)}>
          <ListItemIcon>
            <CardGiftcardIcon />
          </ListItemIcon>
          <ListItemText primary="Products" />
          {openProduct ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openProduct} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link to="/admin/all-products">
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedIndex === 21}
                onClick={() => handleClickProductAll(21)}>
                <ListItemIcon>
                  <RemoveIcon />
                </ListItemIcon>
                <ListItemText primary="All products" />
              </ListItemButton>
            </Link>
            <Link to="/admin/add-product">
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedIndex === 22}
                onClick={() => handleClickProductUpdate(22)}>
                <ListItemIcon>
                  <RemoveIcon />
                </ListItemIcon>
                <ListItemText primary="Create product" />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>

        <ListItemButton selected={selectedIndex === 3} onClick={() => handleClickOrder(3)}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Orders" />
          {openOrder ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openOrder} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link to="/admin/all-orders">
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedIndex === 31}
                onClick={() => handleClickOrderAll(31)}>
                <ListItemIcon>
                  <RemoveIcon />
                </ListItemIcon>
                <ListItemText primary="All orders" />
              </ListItemButton>
            </Link>
            <Link to="/admin/add-order">
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedIndex === 32}
                onClick={() => handleClickOrderUpdate(32)}>
                <ListItemIcon>
                  <RemoveIcon />
                </ListItemIcon>
                <ListItemText primary="Create order" />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
      </List>
    </Grid>
  );
}
