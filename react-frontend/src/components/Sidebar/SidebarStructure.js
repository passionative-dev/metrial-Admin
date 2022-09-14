import React from 'react';
import {
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// components

const structure = [
  { id: 100, label: 'Profile', link: '/app/profile', icon: <ProfileIcon /> },
  { id: 4, type: 'divider' },
  {
    id: 102,
    label: 'UploadFile',
    link: '/app/uploadfile',
    icon: <CloudUploadIcon />,
  },

  {
    id: 101,
    label: 'Operation',
    link: '/app/operation',
    icon: <DeveloperBoardIcon />,
  },
  {
    id: 110,
    label: 'All Operations',
    link: '/app/alloperations',
    icon: <DeveloperBoardIcon />,
  },
  { id: 4, type: 'divider' },
  {
    id: 103,
    label: 'UploadAnalysis',
    link: '/app/uploadanalysis',
    icon: <CloudUploadIcon />,
  },
  {
    id: 104,
    label: 'Analysis',
    link: '/app/analysis',
    icon: <DeveloperBoardIcon />,
  },
  {
    id: 111,
    label: 'All Analysis',
    link: '/app/allanalysis',
    icon: <DeveloperBoardIcon />,
  },

  { id: 5, type: 'divider' },

  {
    id: 1,
    label: 'E-commerce',
    // badge: 'NodeJS',
    // badgeColor: 'success',
    link: '/app/ecommerce',
    icon: <ShoppingCartIcon />,
    children: [
      {
        label: 'Country',
        link: '/app/country',
      },
      {
        label: 'Category',
        link: '/app/categories',
      },
      {
        label: 'Brand',
        link: '/app/ecommerce/brands',
      },
      {
        label: 'Extra Field',
        link: '/app/ecommerce/extra_fields',
      },
      {
        label: 'Product Manage',
        link: '/app/ecommerce/management',
      },
      {
        label: 'Products Grid',
        link: '/app/ecommerce/gridproducts',
      },
      {
        label: 'Product Page',
        link: '/app/ecommerce/product',
      },
    ],
  },
  {
    id: 2,
    label: 'User',
    link: '/app/user',
    // badge: 'New',
    badgeColor: 'secondary',
    icon: <PersonIcon />,
    children: [
      {
        label: 'User List',
        link: '/app/users',
      },
      {
        label: 'User Add',
        link: '/app/user/new',
      },
      {
        label: 'User Edit',
        link: '/app/user/edit',
      },
    ],
  },
  { id: 7, type: 'divider' },
  {
    label: 'Python Error Logs',
    link: '/app/Error',
  },
  {
    label: 'config',
    link: '/app/config',
  },
];

export default structure;
