import { useEffect, useRef, useState, useMemo } from 'react'
import './App.css'
import { UsersLists } from './components/UsersList';
import { SortBy, User } from './types.d';

function App() {

  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const originalUsers = useRef<User[]>([]) //se comparte entre renderizados

  const toggleColors = () => {
    setShowColors(!showColors);
  }

  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue);
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email != email)
    setUsers(filteredUsers)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
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

  const filteredUsers = useMemo(() => { 
    console.log('calculate filteredUsers')

    return typeof filterCountry === 'string' && filterCountry.length > 0
      ? users.filter((user) => {
        return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
      })
      : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    console.log('calculate sortedUsers')
    
    if (sorting === SortBy.NONE) return filteredUsers

    if (sorting === SortBy.COUNTRY) return filteredUsers.toSorted(
      (a, b) => a.location.country.localeCompare(b.location.country)
    )
    if (sorting === SortBy.NAME) return filteredUsers.toSorted(
      (a, b) => a.name.first.localeCompare(b.name.first)
    )

    if(sorting === SortBy.LAST) return filteredUsers.toSorted(
      (a, b) => a.name.last.localeCompare(b.name.last)
    )

    return filteredUsers;
  }, [filteredUsers, sorting])

  return (
    <>
      <h1>Prueba tecnica</h1>
      <header>
        <button onClick={toggleColors}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>{sorting === SortBy.COUNTRY ? 'No ordenar por pais' : 'Ordenar por pais'}</button>
        <button onClick={handleReset}>Resetear users</button>
        <input placeholder='filtra por pais' type="text" onChange={(e) => {setFilterCountry(e.target.value)}} />
      </header>
      <main>
        <UsersLists changeSorting={handleChangeSort} deleteUser={handleDelete} showColors={showColors} users={sortedUsers} />
      </main>
    </>
  )
}

export default App
