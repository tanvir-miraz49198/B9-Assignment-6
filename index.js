let selectedCategory = 1000;
// sorted view default a false kore rakhsi
let sortdByView = false;

document.getElementById("sort-btn").addEventListener('click', () =>{
    sortdByView = true;

    buttonHandle(selectedCategory, sortdByView)
} )

const loadAllData = async () => {
    const res = await fetch("https://openapi.programming-hero.com/api/videos/categories")
    const data = await res.json()
    const categoris = data.data;
   
    const btnContainer = document.getElementById("btn-container");

    categoris.forEach(categori => {

        const newButton = document.createElement('button');
        // newButton a category-btn name akta class add koresi. tahole jotogulo button create hobe sobar category-btn name akta kore class add hobe.
        newButton.className = "btn category-btn  btn-ghost text-white bg-slate-700  text-lg"
        newButton.innerText = categori.category;

       
     

        newButton.addEventListener("click", () => {
            buttonHandle(categori["category_id"], sortdByView);
            // category-btn namer all class k queryselectorAll dia dhoresi. tahone akta nodelist ba array paoa jabe. jake for of loop chalia jei jei button er bg bg-red tader bg remove koresi. ar loop er bahira but click function er vitore oi click kora button a bg-red class add koresi.
            const categoriBtn = document.querySelectorAll(".category-btn");
            for (let button of categoriBtn) {
                // console.log(button)
                button.classList.remove("bg-red-600")
            }
            // jei button a click hobe tader bg red kore disi.
            newButton.classList.add("bg-red-600")
        })

        btnContainer.appendChild(newButton)
        // console.log(categori)
    })
}

// get card-container and error-element element 
const cardContainer = document.getElementById('card-container');
const errorElement = document.getElementById('error-element');



const buttonHandle = async (id, sortdByView) => {
    selectedCategory = id;

    const caseCardData = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
    const cardContent = await caseCardData.json()
    const cardContentArr = cardContent.data;

    // sort by vew for function

   if(sortdByView){
    cardContentArr.sort( (a,b) => {
        const totalViewFirst = a.others.views;
        const totalViewSecond = b.others.views;

        const totalViewFirstNumber = parseFloat(totalViewFirst.replace("K", "")) || 0;

        const totalViewSecondNumber = parseFloat(totalViewSecond.replace("K", "")) || 0;
        return totalViewSecondNumber - totalViewFirstNumber
    })
   }






    // ------------------------------>>>>
    // const sortArr = [];
    // if(sortdByView){
    //     console.log(cardContentArr)
    //     cardContentArr.forEach( obj => {
    //         const objViewsStr = obj.others.views;
    //         const objViewsNum = parseFloat(objViewsStr.replace('K', ""))
    //         sortArr.push(objViewsNum)
           
    //     })
    //     sortArr.sort( (a,b) =>{
    //         return b-a;
    //     })
    //     console.log(sortArr)
    // }
    // ------------------------------>>>>





    // clear card of click the new categori
    cardContainer.innerHTML = "";

    if (cardContentArr.length === 0) {
        errorElement.classList.remove('hidden')
    }
    else {
        errorElement.classList.add('hidden')
    }

    cardContentArr.forEach((singleCard) => {
        // console.log(singleCard)
        let verifiedBadge = "";
        if (singleCard.authors[0]['verified']) {
            verifiedBadge = `<img class="w-6 h-6" src="./images/verify.png" alt=""></img>`
        }

        let postedTime = "";
        if(singleCard.others["posted_date"]){
            const date = singleCard.others["posted_date"];
            // console.log(date)
            let seconds =Math.floor( date / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);

            seconds = seconds % 60;
            minutes = minutes % 60;
            hours = hours % 60;

            const times = hours + " hrs " + minutes + " mins " + seconds + " sec" + " " + "ago" ;
            postedTime = `<h6 class="absolute bottom-[40%] right-12">${times}</h6>`
           
        }
       console.log(singleCard)

        const newCard = document.createElement('div');
        // newCard.className= "grid grid-cols-1 lg:grid-cols-3";
        newCard.innerHTML = `
 
    <div class="card w-full bg-base-100 shadow-xl">
        <figure class="overflow-hidden h-72">
            <img class="w-full" src="${singleCard.thumbnail}" alt="Shoes" />
            ${postedTime}
        </figure>
        <div class="card-body">
            <div class="flex space-x-4 justify-start items-start">
                <div>
                    <img class="w-12 h-12 rounded-full" src="${singleCard.authors[0]["profile_picture"]}" alt="Shoes" />
                </div>
                <div>
                    <h2 class="card-title">${singleCard.title}</h2>
                    <div class="flex mt-3">
                        <p class="">${singleCard.authors[0]["profile_name"]}</p>
                        ${verifiedBadge}
                    </div>
                    <p class="mt-3">${singleCard.others.views}</p>
                </div>
            </div>
        </div>
    </div>

    `

        cardContainer.appendChild(newCard)

    })


    // console.log(cardContentArr)
}


loadAllData()


buttonHandle(selectedCategory, sortdByView)