let menuBtn = document.getElementById("menu-btn");

const msg = document.getElementById("msg");

document.getElementById("menu-btn").addEventListener("click", () => {
  console.log("clicked");
  msg.classList.add("display-none");
});

function closeMessage() {
  setTimeout(() => {
    document.getElementById("msg").classList.add("display-none");
  }, 3000);
}

