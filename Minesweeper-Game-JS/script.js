document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    let width = 10;
    let squares = [];
    let bombAmount = 20;
    let flags = 0;
    let isGameOver = false;

    // Create the board
    function createBoard() {

        // Get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width*width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

       for (let i=0; i< width*width; i++){
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            // Normal click
            square.addEventListener('click', function(e){
                click(square);
            })

            // Control and Left click

            square.oncontextmenu = function(e){
                e.preventDefault();
                addFlag(square);
            }
       } 

         // Add numbers
         for (let i=0; i< squares.length; i++){
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);
            let total = 0;

            if(squares[i].classList.contains('valid')){
                if(i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                if(i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                if(i > 10 && squares[i - width].classList.contains('bomb')) total++;
                if(i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                if(i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
                if(i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                if(i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                if(i < 89 && squares[i + width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data', total);
            }
    }
}

    createBoard();

    // add flag with right click

    function addFlag(square){
        if(isGameOver) return;
        if(!square.classList.contains('checked') && (flags < bombAmount)){
            if(!square.classList.contains('flag') && (flags < bombAmount)){
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                checkForWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
            }
        }
    }

    // Click on square actions
    function click(square){
        let currentId = square.id;
        if(isGameOver) return;
        if(square.classList.contains('checked') || square.classList.contains('flag')) return;
        if(square.classList.contains('bomb')){
            gameOver(square);
        } else {
            let total = square.getAttribute('data');
            if(total != 0){
                square.classList.add('checked');
                square.innerHTML = total;
                return;
            }
            checkSquare(square, currentId);
        } 
        square.classList.add('checked');
    }

    // Check neighboring squares once square is clicked
    function checkSquare(square, currentId){
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(() => {
            if(currentId > 0 && !isLeftEdge){
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId > 9 && !isRightEdge){
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId > 10){
                const newId = squares[parseInt(currentId - width)].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId > 11 && !isLeftEdge){
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId < 98 && !isRightEdge){
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId < 90 && !isLeftEdge){
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId < 88 && !isRightEdge){
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId < 89){
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10);
    }

    // Game over

    function gameOver(square){
        console.log('BOOM! Game Over!');
        isGameOver = true;

        // Show all the bombs

        squares.forEach(square => {
            if(square.classList.contains('bomb')){
                square.innerHTML = '💣';
                square.style.backgroundColor = '#B8B8B8';
            }
        })
    }

    // Check for win

    function checkForWin(){
        let matches = 0;

        for(let i=0; i<squares.length; i++){
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                matches++;
            }
            if(matches === bombAmount){
                console.log('You Win!');
                isGameOver = true;
            }
        }
    }

})