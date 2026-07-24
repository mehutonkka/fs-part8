import { useQuery } from '@apollo/client/react'
import { useState } from 'react'

import { ALL_BOOKS } from '../queries'


const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [selectedGenre, setSelectedGenre] = useState(null)
  

  if (!props.show) {
    return null
  }

  
  if (result.loading) {
    return <div>loading...</div>
  }
  const books = result.data.allBooks

  const genres = [
    ...new Set(books.flatMap((book) => book.genres)),
  ]

  const filteredBooks = selectedGenre
    ? books.filter((book) => book.genres.includes(selectedGenre))
    : books

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && (
        <p>in genre <b>{selectedGenre}</b></p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setSelectedGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
