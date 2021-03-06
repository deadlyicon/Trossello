import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()

// INDEX
router.get('/', (request, response, next) => {
  queries.getBoardsByUserId(request.session.userId).then(boards => {
    response.json(boards)
  }).catch(next)
} )

// CREATE
router.post('/', (request, response, next) => {
  commands.createBoard(request.session.userId, request.body).then( board => {
    response.json(board)
  }).catch(next)
})

// SHOW
router.get('/:boardId', (request, response, next ) => {
  queries.getBoardById(request.params.boardId).then( board => {
    if (board){
      response.json(board)
    }else{
      response.status(404).json(null)
    }
  })
  .catch(next)
})

// UPDATE
router.post('/:boardId', (request, response, next) => {
  commands.updateBoard(request.params.boardId, request.body)
  .then(boardId => {
      response.json(boardId)
  }).catch(next)
})

// DELETE
router.post('/:boardId/delete', (request, response, next) => {
  const boardId = request.params.boardId
  commands.deleteBoard(boardId).then( numberOfDeletions => {
    if (numberOfDeletions > 0) {
      response.status(200).json(null)
    }else{
      response.status(404).json(null)
    }
  }).catch(next)
})

// CREATE LIST
router.post('/:boardId/lists', (request, response, next) => {
  const list = request.body
  const { boardId } = request.params
  list.board_id = boardId
  commands.createList(list)
    .then( list => {
      response.json(list)
    })
    .catch(next)
})

// CREATE CARD
router.post('/:boardId/lists/:listId/cards', (request, response, next) => {
  const card = request.body
  const { boardId, listId } = request.params
  card.board_id = boardId
  card.list_id = listId
  commands.createCard(card)
    .then( card => {
      response.json(card)
    })
    .catch(next)
})

export default router
