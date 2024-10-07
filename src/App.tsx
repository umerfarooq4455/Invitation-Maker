import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Loader from './common/Loader';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import DefaultLayout from './layout/DefaultLayout';
import CategoriesAdd from './pages/Dashboard/CategoriesAdd';
import './index.css';
import { useMyContext } from './contextapi/MyProvider';
import Templatesmain from './pages/Templates/Templatesmain';
import Templatedlistmain from './pages/Templatelist/Templatedlistmain';
import Addfont from './pages/Addfont/Addfont';
import Stikerlist from './pages/Stikerlist/Stikerlist';
import Bglist from './pages/Backgoundlmagelist/Bglist';
import EditTemplateMain from './pages/EditTemplate/EditTemplateMain';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated, handleSignIn, handleSignUp } = useMyContext();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          path="/auth/signin"
          element={<SignIn onSignIn={handleSignIn} />}
        />
        <Route
          path="/auth/signup"
          element={<SignUp onSignUp={handleSignUp} />}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <DefaultLayout>
                <Routes>
                  <Route index element={<CategoriesAdd />} />
                  <Route>
                    <Route
                      index
                      path="templatedlist"
                      element={<Templatedlistmain />}
                    />
                    <Route
                      path="templatedlist/createtemplate"
                      element={<Templatesmain />}
                    />
                    <Route
                      path="templatedlist/Edittemplate"
                      element={<EditTemplateMain />}
                    />
                  </Route>
                  <Route path="/Addfont" element={<Addfont />} />
                  <Route path="/stickerslist" element={<Stikerlist />} />
                  <Route path="/backgroundlist" element={<Bglist />} />
                </Routes>
              </DefaultLayout>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
