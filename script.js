const inputSlider =document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initial values
let password = " ";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
setIndicator("#ccc");


//set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

//indicator color
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//randon int
function setRndInteger(min, max){
    return Math.floor(Math.random()*(max - min)) +min;
}

function generateRandonNumber(){
    return setRndInteger(0,9);
}

function generateRandomLowercase(){
    return String.fromCharCode(setRndInteger(97,123));
}

function generateRandomUppercase(){
    return String.fromCharCode(setRndInteger(65,91));
}

function generateRandomSymbol(){
    const randNum = setRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (error) {
    copyMsg.innerText = "failed";
  }

  copyMsg.classList.add("active");

  setTimeout(()=>{
    copyMsg.classList.remove("active");
  },2000)
}

function shufflePassword(array){
  //fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
let str = "";
array.forEach((el) => (str += el));
return str;

}

function handleCheckboxChange(){
  checkCount = 0;
  allCheckBox.forEach((CheckBox)=>{
    if (CheckBox.checked) {
      checkCount ++;
    }
  });
  
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((CheckBox)=>{
  CheckBox.addEventListener('change', handleCheckboxChange);
})

inputSlider.addEventListener('input', (e)=>{
  passwordLength = e.target.value ;
  handleSlider();
})

copyBtn.addEventListener('click', ()=>{
  //check whether a value is present in pw
  if(passwordDisplay)
    copyContent();
})

generateBtn.addEventListener('click', ()=>{
  if (checkCount <=0) {
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password= "";
  let funcArr = [];
  if (uppercaseCheck.checked) {
    funcArr.push(generateRandomUppercase());
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateRandomLowercase());
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandonNumber());
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateRandomSymbol());
  }

  for(i = 0; i<funcArr.length; i++){
    password += funcArr[i];
  }

  for(i = 0; i < passwordLength-funcArr.length; i++){
    let randIndex = setRndInteger(0, funcArr.length);
    password+= funcArr[randIndex];
  }

  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;
  calcStrength();
})

