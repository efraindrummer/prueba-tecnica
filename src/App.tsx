import { useEffect, useRef, useState } from 'react'
import './App.css'
import { UsersLists } from './components/UsersList';
import { User } from './types';

function App() {

  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sortByCountry, setSortByCountry] = useState(false);
  const originalUsers = useRef<User[]>([]) //se comparte entre renderizados

  const toggleColors = () => {
    setShowColors(!showColors);
  }

  const toggleSortByCountry = () => {
    setSortByCountry(prevState => !prevState);
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email != email)
    setUsers(filteredUsers)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      .catch(err => {
        console.error(err)
      })
  }, []);

  const sortedUsers = sortByCountry 
    ? users.toSorted((a, b) => { //esto esta mal
      return a.location.country.localeCompare(b.location.country)
    }) 
    : users;

  return (
    <>
      <h1>Prueba tecnica</h1>
      <header>
        <button onClick={toggleColors}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>{sortByCountry ? 'No ordenar por pais' : 'Ordenar por pais'}</button>
        <button onClick={handleReset}>Resetear users</button>
      </header>
      <main>
        <UsersLists deleteUser={handleDelete} showColors={showColors} users={sortedUsers} />
      </main>
    </>
  )
}

export default App
