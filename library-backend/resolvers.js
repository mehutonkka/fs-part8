const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')



const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments(),
    authorCount: async () => await Author.countDocuments(),

    allBooks: async (root, args) => {
        const filter = {}

        if (args.author) {
            const author = await Author.findOne({ name: args.author })

            if (!author) {
                return []
            }

            filter.author = author._id
        }

        if (args.genre) {
            filter.genres = args.genre
        }

        return await Book.find(filter).populate('author')
    },

    allAuthors: async () => await Author.find({}),
  },
  Author: {
    bookCount: async (root) => {
      return await Book.countDocuments({ author: root.id })
    },
  },
  Mutation: {
    addBook: async (root, args) => {
        let author = await Author.findOne({ name: args.author })

        if (!author) {
            author = new Author({ name: args.author })
            try {
                await author.save()
            } catch (error) {
                throw new GraphQLError(`Saving author failed: ${error.message}`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.author,
                        error,
                    },
                })
            }
        }
        
        const book = new Book({ ...args, author: author._id })
        try {
            await book.save()
        } catch (error) {
            throw new GraphQLError(`Saving book failed: ${error.message}`, {
                extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.title,
                    error,
                },
            })
        }
        

        return book.populate('author')
    },
      
    editAuthor: async (root, args) => {
        const author = await Author.findOne({ name: args.name })

        if (!author) {
            return null
        }

        author.born = args.setBornTo
        try {
            await author.save()
        } catch (error) {
            throw new GraphQLError(`Updating author failed: ${error.message}`, {
                extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.name,
                    error,
                },
            })
        }

    },
  },
}

module.exports = resolvers
