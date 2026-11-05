// Aplica o tema salvo antes da primeira pintura, para evitar flash. Sem identificadores.
(function () {
  try {
    var salvo = localStorage.getItem("tema");
    var validos = ["ouro", "fosforo", "rubro", "purpura", "pergaminho", "selado"];
    var tema = validos.indexOf(salvo) >= 0 ? salvo : matchMedia("(prefers-color-scheme: light)").matches ? "pergaminho" : "ouro";
    document.documentElement.dataset.tema = tema;
  } catch (e) {}
  document.documentElement.classList.add("js");
})();
