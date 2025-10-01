
import './App.css'
// import UserList from "./components/UserList";
import Inventario from "./modules/inventario-ventas/Inventario";
import Dashboard from './modules/dashboard/Dashboard';


function App() {
  

  return (
    <div style={{ padding: "20px" }}>
        <h1>Farmacia Oasis</h1>
        {/* <Inventario/> */}
        <Dashboard/>
      </div>

  )
}

export default App
