import { useQuery } from '@apollo/client/react'
import { useState } from 'react'

import { ALL_BOOKS, FAVORITE_GENRE } from '../queries'


const Recommend = (props) => {
  const result = useQuery(ALL_BOOKS)
  const favoriteGenreResult = useQuery(FAVORITE_GENRE)

  

  if (!props.show) {
    return null
  }

  
  if (result.loading) {
    return <div>loading...</div>
  }

  if (favoriteGenreResult.loading) {
    return <div>loading...</div>
  }

  const favoriteGenre = favoriteGenreResult.data?.me?.favoriteGenre

  const books = result.data.allBooks

  const filteredBooks = favoriteGenre
    ? books.filter((book) => book.genres.includes(favoriteGenre))
    : books

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{favoriteGenre}</b></p>
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
    </div>
  )
}

export default Recommend
