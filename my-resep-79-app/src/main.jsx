import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Product from './pages/Products.jsx';
import AddRecipes from './pages/resep/AddRecipes.jsx';
import ResepSaya from './pages/resep/ResepSaya.jsx';
import ResepFavorite from './pages/resep/ResepFavorite.jsx';
import DetailProduct from './pages/resep/DetailProduct.jsx';
import EditRecipe from './pages/resep/EditRecipe.jsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },

  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <Product />
  },
  {
    path: "/addRecipes",
    element: <AddRecipes />
  },
  {
    path: "/resepSaya",
    element: <ResepSaya />
  },
  {
    path: "/resepFavorite",
    element: <ResepFavorite />
  },
  {
    path: "/resep/:id",
    element: <DetailProduct />
  },
  {
    path: "/resep/edit/:id",
    element: <EditRecipe />
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
