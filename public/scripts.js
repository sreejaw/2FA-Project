const checkSession = async () => {
  const response = await fetch("/check");
  const { success, id, persona } = await response.json();
  $("#loginForm").removeClass("codeRequested");
  $("#2FABox").removeClass("ready");
  if (success) {
    console.log(persona);
    $("body").addClass("logged");
    $("#userId").text(persona.fname);
    $("#userAge").text(persona.age);
    $.each(persona.workout, function (index, value) {
      $("#userWorkouts").append(value + "<br>");
    });
    $.each(persona.diet, function (index, value) {
      $("#userDiet").append(value + "<br>");
    });
  } else {
    $("body").removeClass("logged");
    $("#userId").text("");
    $("#userAge").text("");
    $("#userWorkouts").text("");
    $("#userDiet").append("");
  }
};

jQuery(document).ready(($) => {
  checkSession();

  $("#logoutButton").click(async (e) => {
    await fetch(`/logout`);
    await checkSession();
  });

  $("#loginForm").submit(async (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    const password = e.target.password.value;
    const code = e.target.code.value;
    let url = `/login?id=${id}&password=${password}`;
    if (code) url += `&code=${code}`;
    const response = await fetch(url);
    const { success, error, codeRequested } = await response.json();

    if (codeRequested) return $("#loginForm").addClass("codeRequested");

    if (success) {
      $("#loginForm").trigger("reset");
      await checkSession();
    } else {
      alert(error);
    }
  });

  $("#enable2FAButton").click(async (e) => {
    const response = await fetch("/qrImage");
    const { image, success } = await response.json();
    if (success) {
      $("#qrImage").attr("src", image);
      $("#2FABox").addClass("ready");
    } else {
      alert("unable to fetch the qr image");
    }
  });

  $("#twoFAUpdateForm").submit(async (e) => {
    e.preventDefault();
    const code = e.target.code.value;
    const response = await fetch("/set2FA?code=" + code);
    const { success } = await response.json();
    if (success) {
      alert("SUCCESS: 2FA enabled/updated");
    } else {
      alert("ERROR: Unable to update/enable 2FA");
    }
    $("twoFAUpdateForm").trigger("reset");
  });
});

function toggleNavbar(collapseID) {
  document.getElementById(collapseID).classList.toggle('hidden')
  document.getElementById(collapseID).classList.toggle('block')
}


// AOS.init({
//   delay: 200,
//   duration: 1200,
//   once: false,
// })

var movementStrength = 25;
var height = movementStrength / window.screen.height;
var width = movementStrength / window.screen.width;
const hero = document.getElementById("section-hero");

hero.addEventListener("mousemove", (e) => {
  var pageX = e.clientX - window.screen.width / 2;
  var pageY = e.clientY - window.screen.height / 2;
  var newvalueX = width * pageX * -1 - 10;
  var newvalueY = height * pageY * -1 - 0;
  hero.style.backgroundPosition = newvalueX + "px     " + newvalueY + "px";

  const div = document.createElement("div");
  div.classList.add("hero-section-mouseClick");
  div.style.left = e.clientX + "px";
  div.style.top = e.clientY + "px";
  const box = document.getElementById("section-hero");
  box.appendChild(div);
  setTimeout(() => {
    box.removeChild(div);
    div.remove();
  }, 250);
});