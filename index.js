const searchinput=document.querySelector('.search');
const searchbutton=document.querySelector('.button');
const recipecontainer=document.querySelector('.recipe');
const recipecontainer1=document.querySelector('.recipe1');
const homeSection = document.querySelector('.home');
const recipecontent= document.querySelector('.reccontent');
const closebut = document.querySelector('.close');
const pinned=document.querySelector('.pin')
const bookmark=document.querySelector('.heart')
// Function to remove the background image when searching
const removeBackgroundImage = () => {
   homeSection.style.background = 'none'; 
    //homeSection.classList.remove('home');
   // recipecontainer.classList.remove('recipe');
     // Removes the background image
};


const getrecipes= async (label)=>{
    recipecontainer.innerHTML=""
    pinned.innerHTML=""
    recipecontainer1.innerHTML="<h2 >Fetching recipes...</h2>"
    try{
const dat= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${label}`)
const res= await dat.json()
recipecontainer1.innerHTML=""
recipecontainer.innerHTML=""
console.log(res)

res.meals.forEach(k => {

    console.log(k)
    const recdiv=document.createElement('div')
    recdiv.classList.add('recip')
    recdiv.innerHTML=`<nav>
    
    <img " src="${k.strMealThumb}">
  <button onclick="favorites('${k.strMeal}','${k.idMeal}')"> <i class="fa-solid fa-heart" id="hearts-${k.idMeal}"></i></button>
      <h3 >${k.strMeal}</h3>
    <p > ${k.strArea} Dish</p>
    <p >${k.strCategory}</p></nav>
    
    `
    const but=document.createElement("button")
    but.classList.add('recipebutton')
    but.textContent="View Recipe"
    recdiv.appendChild(but);
    but.addEventListener(`click`,()=>{
         showr(k);
    })
   
    recipecontainer1.appendChild(recdiv)


});}
catch(error){
recipecontainer1.innerHTML="<h2>Error in fetching recipes</h2>"
}
}
const showr=(k)=>{
    
    recipecontent.innerHTML=`
     <h2 class="recname">${k.strMeal}</h2>
   <h3 class="recin">Ingredients:</h3>
   <ul class="recingredient">${getIngredients(k)}</ul>
<div> 
   <h3 class="rin">Instructions:</h3>
   <p class="rinstruction">${k.strInstructions}</p>
   </div>
    ` 
    
    recipecontent.parentElement.style.display="block"

}

let favfood=[]
const favorites=async (food,mealId)=>{
const d=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`)
const r=await d.json()
console.log(r.meals)

  const hearticon=document.querySelector(`#hearts-${mealId}`)
// hearticon.classList.toggle('filled')


const foodindex=favfood.findIndex(fav=>fav.idMeal===r.meals[0].idMeal)
if(hearticon.classList.contains('filled')){
    hearticon.classList.remove('filled')
    if(foodindex!==-1){
      favfood.splice(foodindex,1)
  }
  const pinneditem=pinned.querySelector('.fav-items')
  pinneditem.forEach(item=>{
    if(item.querySelector('h3').innerText===r.meals[0].strMeal){
        pinned.removeChild(item)
    }
  })
}else{
    hearticon.classList.add('filled')
    if(foodindex===-1){
favfood[favfood.length]=r.meals[0]

    }
// favfood.push=r
// for(let i=0;i<favfood.length;i++){
//     console.log(favfood[i])
// }
}
 console.log(favfood)


}
const getIngredients=(me)=>{
    let ingred="";
    for(let i =1;i<40 ;i++){
        const ing=me[`strIngredient${i}`];
        if(ing){
            const m=me[`strMeasure${i}`];
            ingred+=`<li>${m}${ing}</li>`
        }
        else{
            break;
        }
    }
    return ingred;
}
closebut.addEventListener(`click`,()=>{
    recipecontent.parentElement.style.display="none";


})


searchbutton.addEventListener('click',(x)=>{
    // removeBackgroundImage();
x.preventDefault()
const value=searchinput.value.trim()
if(!value){
    recipecontainer.innerHTML=""
    recipecontainer1.innerHTML="<h2>please Type any meal in search box</h2>"
    return
}
getrecipes(value)
console.log("button click")
    })


bookmark.addEventListener('click',(x)=>{

x.preventDefault()
recipecontainer.innerHTML=""
recipecontainer1.innerHTML=""

console.log(favfood)
if(favfood&&favfood.length>0){
 let foo=favfood
foo.forEach((z)=>{
    console.log(z)
    console.log(z.strArea)
    const exist=pinned.querySelector(`[data-id="${z.idMeal}"]`)
    if(exist){
        return
    }
    
    const fav=document.createElement('div')
    fav.classList.add('fav-items')
    fav.setAttribute("data-id",z.idMeal)
    fav.innerHTML=`<nav>
    <img src="${z.strMealThumb}">
    <h3>${z.strMeal}</h3>
    <p>${z.strArea}</p>
    <p>${z.strCategory}</P>
    <button class="heart-btn">
    <i class="fa-solid fa-heart "></i></button>
    </nav> 
    `
    const but=document.createElement('button')
    but.classList.add('fav-button')
    but.textContent="View Recipe"
    fav.appendChild(but)
    but.addEventListener(`click`,()=>{
        showr(z);
   })

    pinned.appendChild(fav)
    const heartbtn=fav.querySelector(".heart-btn")
    // heartbtn.classList.add('filled')
    heartbtn.addEventListener("click",()=>{
        
   pinned.removeChild(fav)
   favfood=favfood.filter((item)=>item.idMeal!==z.idMeal)
   console.log("removing child")
    })
}
)}
    else{
        console.error("no fav meals found")
        recipecontainer.innerHTML="<p> No favorites available</p>"
    }

})