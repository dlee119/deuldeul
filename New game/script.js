let treeCount = 0;
let axeSpeed = 5000;  // 초기 속도: 5초
let cuttingTrees = false;
let totalTrees = 20; // 필드에 배치할 나무 수
let trees = [];
let cuttingInterval;
let isMoving = false; // 캐릭터가 움직이는 중인지 확인
let upgradeCount = 0; // 업그레이드 횟수

const CHARACTER_IMAGE_URL = 'https://mcusercontent.com/72d5a2545cb453b2c60caf4ad/images/96414e9f-b76c-d5ef-d7ad-dfbacec6035c.png'; // 캐릭터 이미지 URL
const TREE_IMAGE_URL = 'https://mcusercontent.com/72d5a2545cb453b2c60caf4ad/images/41a2e5f3-7cd4-2397-b827-b0d340f6badf.png'; // 나무 이미지 URL
const TREE_CUT_SOUND_URL = 'https://mcusercontent.com/72d5a2545cb453b2c60caf4ad/files/b3f46169-4f74-6a62-3bdb-c41b673fc8ce/Frozen_Tree_Branch_Break.wav'; // 나무 베는 소리 URL (사용자가 제공할 URL)
const UPGRADE_SOUND_URL = 'https://mcusercontent.com/72d5a2545cb453b2c60caf4ad/files/3c23fcf9-06e2-5e03-915d-e6d0a4f6b447/audiomass_output.mp3'; // 업그레이드 소리 URL

// 소리 요소 생성
const cutSound = new Audio(TREE_CUT_SOUND_URL);
const upgradeSound = new Audio(UPGRADE_SOUND_URL);

document.getElementById('newGame').addEventListener('click', startNewGame);
document.getElementById('continueGame').addEventListener('click', continueGame);
document.getElementById('quitGame').addEventListener('click', quitGame);
document.getElementById('upgradeButton').addEventListener('click', upgradeAxe);

const character = document.getElementById('character');

function startNewGame() {
    document.querySelector('.menu').classList.add('hidden');
    document.querySelector('.game').classList.remove('hidden');
    treeCount = 0;
    axeSpeed = 5000;
    upgradeCount = 0;
    updateTreeCount();
    updateAxeSpeed();
    updateUpgradeCount();
    document.getElementById('upgradeButton').classList.remove('hidden');
    initializeField();
    startCuttingTrees();
}

function continueGame() {
    alert('이어하기 기능은 아직 구현되지 않았습니다.');
}

function quitGame() {
    if (confirm('게임을 종료하시겠습니까?')) {
        alert('게임을 종료할 수 없습니다. 수동으로 창을 닫아주세요.');
    }
}

function updateTreeCount() {
    document.getElementById('treeCount').innerText = treeCount;
}

function updateAxeSpeed() {
    document.getElementById('axeSpeed').innerText = (axeSpeed / 1000).toFixed(1) + '초';
}

function updateUpgradeCount() {
    document.getElementById('upgradeCount').innerText = upgradeCount;
}

function initializeField() {
    const treesContainer = document.getElementById('trees');
    treesContainer.innerHTML = ''; // 기존 나무 제거
    trees = [];

    for (let i = 0; i < totalTrees; i++) {
        const treeDiv = document.createElement('div');
        treeDiv.classList.add('tree');
        const treeImg = document.createElement('img');
        treeImg.src = TREE_IMAGE_URL; // 나무 이미지 URL 설정
        treeImg.alt = '나무';
        treeDiv.appendChild(treeImg);
        treesContainer.appendChild(treeDiv);
        trees.push(treeDiv);
    }
}

function startCuttingTrees() {
    if (cuttingTrees) return;
    cuttingTrees = true;

    cuttingInterval = setInterval(() => {
        const availableTrees = trees.filter(tree => !tree.classList.contains('cut'));
        if (availableTrees.length === 0) {
            initializeField();
            return;
        }

        const treeToCut = availableTrees[Math.floor(Math.random() * availableTrees.length)];
        moveToTreeAndCut(treeToCut);
    }, axeSpeed);
}

function moveToTreeAndCut(tree) {
    if (isMoving) return; // 캐릭터가 이미 움직이고 있으면 중복 실행 방지
    isMoving = true;

    const treeRect = tree.getBoundingClientRect();
    const fieldRect = document.querySelector('.field').getBoundingClientRect();
    const characterRect = character.getBoundingClientRect();

    // 나무 위치로 캐릭터 이동
    const newLeft = (treeRect.left + treeRect.width / 2) - (fieldRect.left + characterRect.width / 2);
    const newTop = (treeRect.top + treeRect.height / 2) - (fieldRect.top + characterRect.height / 2);

    character.style.left = newLeft + 'px';
    character.style.top = newTop + 'px';

    // 캐릭터가 이동한 후에 나무를 베는 동작
    setTimeout(() => {
        cutTree(tree);
        isMoving = false; // 이동 종료
    }, 2000); // 2초 후에 도착하는 시간
}

function cutTree(tree) {
    tree.classList.add('cut');
    treeCount++;
    updateTreeCount();

    // 나무를 베는 소리 재생
    cutSound.play();

    if (treeCount >= 100 && axeSpeed === 5000) {
        // 도끼 업그레이드: 100개 나무를 베면
        axeSpeed = 2000;  // 2초로 변경
        updateAxeSpeed();
        clearInterval(cuttingInterval);
        cuttingTrees = false;  // 업그레이드를 위해 플래그 리셋
        startCuttingTrees(); // 새로운 속도로 재시작
    }
}

function upgradeAxe() {
    if (treeCount > 0) {
        axeSpeed -= 100; // 0.1초씩 속도 증가
        if (axeSpeed < 100) axeSpeed = 100; // 최소 0.1초까지 제한
        treeCount--; // 나무 1개 차감
        upgradeCount++; // 업그레이드 횟수 증가
        updateTreeCount();
        updateAxeSpeed();
        updateUpgradeCount();

        // 업그레이드 소리 재생
        upgradeSound.play();

        // 기존 인터벌을 멈춘 뒤 cuttingTrees를 false로 설정하여 재시작
        clearInterval(cuttingInterval);
        cuttingTrees = false; // 이 플래그를 false로 변경하여 다시 시작 가능하게 만듦
        startCuttingTrees(); // 새로운 속도로 재시작
    } else {
        alert('업그레이드할 나무가 부족합니다.');
    }
}

// 초기 이미지 설정
document.getElementById('character').src = CHARACTER_IMAGE_URL;


window.addEventListener('hashchange', function() {
    const hash = location.hash.replace('#', '');
    if (hash === 'newGame') {
        // 새 게임 시작 코드 실행
    } else if (hash === 'continueGame') {
        // 이어하기 코드 실행
    } else if (hash === 'quitGame') {
        // 게임 종료 코드 실행
    }
});

// 페이지 로딩 시 초기 설정
window.addEventListener('load', function() {
    if (location.hash === '') {
        location.hash = '#newGame';
    }
});

