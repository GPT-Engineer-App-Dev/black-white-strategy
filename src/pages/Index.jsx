import React, { useState } from "react";
import { Box, Button, Heading, Grid, GridItem, Text, VStack } from "@chakra-ui/react";

const BOARD_SIZE = 8;
const EMPTY = null;
const BLACK = "B";
const WHITE = "W";

const initialBoard = () => {
  const board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(EMPTY));
  board[3][3] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  board[4][4] = WHITE;
  return board;
};

const Index = () => {
  const [board, setBoard] = useState(initialBoard());
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);

  const isValidMove = (row, col) => {
    if (board[row][col] !== EMPTY) return false;

    const opponent = currentPlayer === BLACK ? WHITE : BLACK;
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let hasOpponent = false;

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        if (board[x][y] === EMPTY) break;
        if (board[x][y] === opponent) {
          hasOpponent = true;
        } else if (hasOpponent) {
          return true;
        }
        x += dx;
        y += dy;
      }
    }
    return false;
  };

  const flipPieces = (row, col) => {
    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = currentPlayer;

    const opponent = currentPlayer === BLACK ? WHITE : BLACK;
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let piecesToFlip = [];

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        if (newBoard[x][y] === EMPTY) break;
        if (newBoard[x][y] === opponent) {
          piecesToFlip.push([x, y]);
        } else if (piecesToFlip.length > 0) {
          piecesToFlip.forEach(([fx, fy]) => {
            newBoard[fx][fy] = currentPlayer;
          });
          break;
        } else {
          break;
        }
        x += dx;
        y += dy;
      }
    }

    setBoard(newBoard);
    setCurrentPlayer(opponent);
  };

  const handleClick = (row, col) => {
    if (isValidMove(row, col)) {
      flipPieces(row, col);
    }
  };

  const countPieces = () => {
    let blackCount = 0;
    let whiteCount = 0;
    for (let row of board) {
      for (let cell of row) {
        if (cell === BLACK) blackCount++;
        if (cell === WHITE) whiteCount++;
      }
    }
    return { blackCount, whiteCount };
  };

  const { blackCount, whiteCount } = countPieces();

  return (
    <VStack spacing={8}>
      <Heading>Othello</Heading>
      <Text>Current Player: {currentPlayer === BLACK ? "Black" : "White"}</Text>
      <Grid templateColumns={`repeat(${BOARD_SIZE}, 1fr)`} gap={1}>
        {board.map((row, rowIdx) => row.map((cell, colIdx) => <GridItem key={`${rowIdx}-${colIdx}`} w={12} h={12} bg={cell === BLACK ? "black" : cell === WHITE ? "white" : "green.500"} onClick={() => handleClick(rowIdx, colIdx)} cursor="pointer" />))}
      </Grid>
      <Text>
        Black: {blackCount} | White: {whiteCount}
      </Text>
      <Button onClick={() => setBoard(initialBoard())}>Reset</Button>
    </VStack>
  );
};

export default Index;
