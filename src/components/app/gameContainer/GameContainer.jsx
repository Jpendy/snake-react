/* eslint-disable keyword-spacing */
/* eslint-disable max-len */
/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';

export default function GameContainer() {


    const [snake, setSnake] = useState([{ x: 20, y: 20 }]);
    const [speed, setSpeed] = useState(300);
    const [fruit, setFruit] = useState(randomFruitLocation(snake));
    const [points, setPoints] = useState(0);
    const [dir, setDir] = useState('down');

    const tileSize = 20;

    useInterval(() => {
        const grow = isSamePosition(snake, fruit.x, fruit.y);
        if (grow) {
            setSpeed(speed => speed - 3);
            setFruit(() => randomFruitLocation(snake));
            setPoints(points => points + 10);
        }

        setSnake(snake => {
            const [snakeHead, ...snakeTail] = snake;
            switch (dir) {
                case 'right': return [{ x: snakeHead.x + tileSize, y: snakeHead.y }, ...updateTail(snakeHead, snakeTail, grow)];
                case 'left': return [{ x: snakeHead.x - tileSize, y: snakeHead.y }, ...updateTail(snakeHead, snakeTail, grow)];
                case 'up': return [{ x: snakeHead.x, y: snakeHead.y - tileSize }, ...updateTail(snakeHead, snakeTail, grow)];
                case 'down': return [{ x: snakeHead.x, y: snakeHead.y + tileSize }, ...updateTail(snakeHead, snakeTail, grow)];
                default: return;
            }
        });

        if (outOfBounds(snake) || isSamePosition(snake.slice(1), snake[0].x, snake[0].y)) {
            window.alert('You\'re Dead!!!');
            resetGame();
        }

    }, speed);

    useEffect(() => {
        document.addEventListener('keydown', ({ key }) => {
            switch (key) {
                case 'ArrowRight': setDir('right'); break;
                case 'ArrowLeft': setDir('left'); break;
                case 'ArrowUp': setDir('up'); break;
                case 'ArrowDown': setDir('down'); break;
                default: return;
            }
        });
    }, []);

    function randomFruitLocation(snake) {
        let randomX = Math.floor(Math.random() * 19 + 1) * 20;
        let randomY = Math.floor(Math.random() * 19 + 1) * 20;
        const fruitPosition = { x: randomX, y: randomY };

        while (isSamePosition(snake, randomX, randomY)) {
            randomX = Math.floor(Math.random() * 19 + 1) * 20;
            randomY = Math.floor(Math.random() * 19 + 1) * 20;
        }
        return fruitPosition;
    }

    function isSamePosition(snake, randomX, randomY) {
        return snake.some(({ x, y }) => {
            return (
                randomX < x + tileSize &&
                randomX + tileSize > x &&
                randomY < y + tileSize &&
                randomY + tileSize > y
            );
        });
    }

    function resetGame() {
        setSnake([{ x: 20, y: 20 }]);
        setSpeed(500);
        setFruit(randomFruitLocation(snake));
        setPoints(0);
        setDir('down');
    }

    const fruitStyle = {
        position: 'absolute',
        top: fruit.y,
        left: fruit.x,
        width: '20px',
        height: '20px',
    };

    const backgroundStyle = {
        position: 'absolute',
        left: '20px',
        top: '20px',
        height: '400px',
        width: '400px',
        backgroundColor: 'lightskyblue'
    };

    const rotateMap = {
        left: '90deg',
        right: '-90deg',
        down: '0deg',
        up: '180deg'
    };

    return (
        <div>
            <div>{points}</div>
            <div style={backgroundStyle} />
            <img src="pear.png" style={fruitStyle} />
            {snake.map((_, i) => {
                const snakeStyle = {
                    position: 'absolute',
                    width: '20px',
                    height: '20px',
                    top: snake[i].y,
                    left: snake[i].x,
                };
                if (i === 0) return (
                    <img
                        key={i}
                        src="snakeHead.png"
                        style={{
                            ...snakeStyle,
                            transform: `scale(1.1) rotate(${rotateMap[dir]})`
                        }}
                    />
                );

                return (
                    <div
                        key={i}
                        style={{
                            ...snakeStyle,
                            backgroundColor: 'limegreen'
                        }}
                    />
                );
            })}
        </div>
    );
}

function updateTail(head, tail, grow) {
    const newTail = tail.map((_, i, tail) => {
        if (i === 0) return head;
        return tail[i - 1];
    });

    if (grow) newTail.push(tail[tail.length - 1] || head);
    return newTail;
}

function outOfBounds([snake]) {
    return (
        snake.x < 20 ||
        snake.x >= 420 ||
        snake.y < 20 ||
        snake.y >= 420
    );
}

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}



