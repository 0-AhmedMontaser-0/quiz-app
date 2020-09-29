let countSpan = document.querySelector(".count span");
let bullets=document.querySelector(".bullets")
let bulletSpanContainer=document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea =document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer=document.querySelector(".results")
let countdownElement=document.querySelector(".countdown")
//set Options
let currentIndex= 0
let rightAnswers=0
let countdownInterval

function getQuestions(){
	let myRequest= new XMLHttpRequest();
	myRequest.onreadystatechange=function(){
		if(this.readyState===4 && this.status===200){
			let questionObject=JSON.parse(this.responseText)
			console.log(questionObject[3].title)
			let qCount=questionObject.length
			console.log(qCount)
			//create bullet and set questions count
			
			createBullets(qCount)
				
		 addQuestionData(questionObject[currentIndex],qCount)
	//start count down
	countdown(10,qCount)
		 
					//click button
			submitButton.onclick=function(){
				//get  right answer
				let theRightAnswer=questionObject[currentIndex].right_answer
			    	console.log(theRightAnswer)
					
					//check answer
					checkAnswer(theRightAnswer,qCount)
					
				     //increase Index
					currentIndex++
					
					quizArea.innerHTML="";
					answersArea.innerHTML="";
					 addQuestionData(questionObject[currentIndex],qCount)
					 
					 //handle Bulletsm
					 handleBullets()
					clearInterval(countdownInterval);
					countdown(10,qCount);
					 	 //show results
						showResults(qCount)
		    	}
				
		}
	}
	myRequest.open("GET","data.json",true);
	myRequest.send();
}
getQuestions()
function createBullets(num){
	countSpan.innerHTML=num;
	//create Bullet
	for(i=0;i<num;i++){
		let bullet =document.createElement("span");
		if(i===0)bullet.className="on";
		
		bulletSpanContainer.appendChild(bullet)
			
	}
}
function addQuestionData (obj,count){
	
	if(currentIndex<count){
	

	//create h2
	let questionTitle =document.createElement("h2");
	let questionsText = document.createTextNode(obj["title"]);
	
	
	questionTitle.appendChild(questionsText)
	quizArea.appendChild(questionTitle);
	
	//create Answers
	for(let i = 1;i<= 4;i++){
		//create dev answer;
		let mainDiv=document.createElement("div");
		mainDiv.className="answer";
		//create radio input
	      let radioInput =document.createElement("input")
		//add type name id data attribute
		 radioInput.name="question";
		  radioInput.type="radio";
		   radioInput.id=`answer_${i}`;
		     radioInput.dataset.answer=obj[`answer_${i}`]
			 
			 if(i === 1)radioInput.checked=true
			 
			//create label
let thelabel=document.createElement("label");

thelabel.htmlFor=`answer_${i}`
//create label text
let labelText= document.createTextNode(obj[`answer_${i}`])
thelabel.appendChild(labelText);

//append input to main div + label
mainDiv.appendChild(radioInput)
mainDiv.appendChild(thelabel)
//append all div to answes area
answersArea.appendChild(mainDiv)

	}
	}
}
function checkAnswer(rAnswer,Count){
	//answers => radio input
	let answers =document.getElementsByName("question")
	let theChoosenAnswer
	console.log(answers)
	for(let i=0;i<answers.length;i++){
		
		if(answers[i].checked===true){
			theChoosenAnswer=answers[i].dataset.answer
		}
		
	}
	console.log(rAnswer)
	console.log(theChoosenAnswer);
	if(rAnswer===theChoosenAnswer){
		rightAnswers++
		console.log("Good Answer")
		console.log(rightAnswers)
	}
}


function handleBullets(){
	let bulletsSpans=document.querySelectorAll(".bullets .spans span")
	console.log(bulletsSpans)
	let arrayOfSpans=Array.from(bulletsSpans);
	console.log(arrayOfSpans)
	arrayOfSpans.forEach((span,index)=>{
		if(currentIndex===index){
			span.className="on"
		}
	})
	
}
function showResults(count){
	
	let theResults;
	
	if(currentIndex === count){

	quizArea.remove();
	answersArea.remove();
	submitButton.remove();
	bullets.remove();
	
			if(rightAnswers > (count/2) && rightAnswers<count){
				theResults=`<span class="good">Good</span> , ${rightAnswers} from ${count}`;
				document.getElementById("success").play()
				
			}else if(rightAnswers===count){
				theResults=`<span class="perfect">perrfect</span> , Great Work`;
					document.getElementById("success").play()
			}else{
				theResults=`<span class="bad">bad</span> , ${rightAnswers} from ${count}`;
					document.getElementById("fail").play()
			}
		resultsContainer.innerHTML=theResults;
		resultsContainer.style.padding="20px";
		resultsContainer.style.backgroundColor="White";
		resultsContainer.style.marginTop="10px";
	}
}
function countdown(duration,count){
	if(currentIndex<count){
		let minuters,secounds;
		countdownInterval=setInterval(function(){
			
			minutes=parseInt(duration/60);
			secounds=(duration%60);
			
			minutes=minutes<10 ?`0${minutes}`:minutes
			secounds=secounds<10 ? `0${secounds}`:secounds
			countdownElement.innerHTML=`${minutes}:${secounds}`;
		
			 if(--duration<0){
				 clearInterval(countdownInterval);
				 submitButton.click()
			 }
		},1000)
	}
}
