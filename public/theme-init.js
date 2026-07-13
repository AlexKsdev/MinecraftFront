(function () {
  try {
    if (localStorage.getItem("pc-theme") === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } catch (e) {}
})();
