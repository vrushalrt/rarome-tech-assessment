// import logo from './logo.svg';
import './App.css';
import TableComponent from "./components/TableComponent/TableComponent";
import "antd/dist/reset.css"; // Ant Design styles

function App() {
  return (
    <div className="App">
      <h1>Application List</h1>
      <TableComponent />
    </div>
  );
}

export default App;
