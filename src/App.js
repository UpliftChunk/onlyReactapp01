// media


// styles
import './App.css';

// elements
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


// components
import Rootlayout from './Rootlayout'
import AddUser from './components/adduser/AddUser'
import CurUsers from './components/currentusers/CurUsers'
import RemovedUsers from './components/removedusers/RemovedUsers'


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element:<Rootlayout/>,
      children: [
        {
          path: "/",
          element: <AddUser/>
        }
        ,
        {
          path: "/users",
          element: <CurUsers/>
        }
        ,
        {
          path: "/removedUsers",
          element: <RemovedUsers/>
        }
      ]
    }
  ])

  return (
    <div className='all App'>
      {/* //!put router in the div with no absolute positioned elements, to work */}
        <RouterProvider router={router}/>
            
    </div>
  );
}

export default App;
