// import logo from './logo.svg';
import { Route,Routes } from 'react-router-dom';
import './App.css';
import BlogHomePageComponent from './component/blogHome';
import RegisterPageComponent from './component/register';
import LoginPageComponent from './component/login'
import UserHomePageComponent from './component/userHome'
import UserBlogsPage from './component/userBlogPage'

function App() {
  return (
  <Routes>
    <Route path='/' element={<BlogHomePageComponent></BlogHomePageComponent>} ></Route>
    <Route path='/register' element={<RegisterPageComponent></RegisterPageComponent>} ></Route>
    <Route path='/login' element={<LoginPageComponent></LoginPageComponent>} ></Route>
    <Route path='/userHome' element={<UserHomePageComponent></UserHomePageComponent>} ></Route>
    <Route path='/userBlog' element={<UserBlogsPage></UserBlogsPage>} ></Route>
  </Routes>
  );
}

export default App;
