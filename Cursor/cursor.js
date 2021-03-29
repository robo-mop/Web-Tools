var cursor;

function cursor_setup()
{
    cursor = document.getElementById("cursor");

    window.addEventListener("mousemove", function(event){
        cursor.style = `top: ${event.clientY-25}px; left: ${event.clientX-25}px;`;
    });
}
