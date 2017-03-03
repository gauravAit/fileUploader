
w_url = window.URL || window.webkitURL;
var handleAllConfigurableInputs = function() {
  document.querySelectorAll("input[type=file].custom-configurable-uploader").forEach(function(input){
    var uploader_holder = document.createElement('div');
    uploader_holder.innerHTML = "<div class='custom-configurable_uploader progress_outer'><div class='custom-configurable_uploader progress'></div></div>";
    var new_img_tag = document.createElement('img');
    new_img_tag.style.display = "none";
    new_img_tag.style.cssText = "display: none; width: auto; height: " + (input.dataset.imageDisplayHeight || "100 px") + ";";
    uploader_holder.insertBefore(new_img_tag,  uploader_holder.firstChild);
    input.parentNode.insertBefore(uploader_holder, input);
    addUploadButton(input);
    attachEventToTheFileInput(input)
  });
}

function getMyImgElement(input) {
  return input.previousSibling.firstChild;
}

function attachEventToTheFileInput(input) {
    input.addEventListener('change',function(e){
      e.preventDefault();
      var input = e.target;
      if (input.files[0]) {
        var image = getMyImgElement(input);
        image.onload = function() {
          image.style.display = "block";
        };
        image.onerror = function() {
          alert('Invalid image');
          image.src = "";
          image.style.display = "none";
        };
        debugger;
        image.src = window_url.createObjectURL(input.files[0]);    
      }
    });   
}
  
function uploadSelectedfile(selected_file, url, progress_bar_container, additiona_data) {
    var formData = new FormData();
    //formData.append("userFile", selected_file);
    // additional data
    Object.keys(additiona_data).forEach(function(key) {
    	formData.append(key, additiona_data[key]);
    });
    var xhr = new XMLHttpRequest();
    var progress_bar = progress_bar_container.lastChild;
    progress_bar.style.width = "0%";
    progress_bar_container.style.display = "block";
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4){
          try {
              var on_complete_response = JSON.parse(request.response);
          } catch (e){
              var on_complete_response = {
                  status: 'error',
                  data: 'Unexpected error: [' + xhr.responseText + ']'
              };
          }
             document.querySelectorAll('.progress_outer').forEach(function(elem){
          elem.style.display = "none";
          });
          console.log(on_complete_response.status + ': ' + on_complete_response.data);
      }
    };

  xhr.upload.addEventListener('progress', function(e){
      progress_bar.style.width = Math.ceil(e.loaded/e.total) * 100 + '%';
  }, false);
  xhr.open("POST", url);
  
  var reader = new FileReader();
  reader.readAsArrayBuffer(selected_file);
    reader.onload = function() {
      var arrayBuffer = reader.result
      var bytes = new Uint8Array(arrayBuffer);
      var customized_file = new File(bytes, "userfile.jpeg", {type: "image/jpeg"});
      formData.append("userFile", customized_file);
      xhr.send(formData);
    }  
  progress_bar.style.display = "block";
}
  
function addUploadButton(input) {
  // target is what you want it to go after. Look for this elements parent.
  var upload_button = document.createElement("button");
  upload_button.innerHTML = "Upload";
  upload_button.style.cssText = "margin-top: 10px; background: green;color: white;border: 1px solid green;border-radius: 5px;font-size: 16px";
  var parent = input.parentNode;
  // if the parents lastchild is the targetElement...
  if (parent.lastChild == input) {
      // add the newElement after the target element.
      parent.appendChild(upload_button);
  } else {
      // else the target has siblings, insert the new element between the target and it's next sibling.
      parent.insertBefore(upload_button, input.nextSibling);
  }
  attachEventToUploadButton(upload_button);
}

function attachEventToUploadButton(button) {
	button.addEventListener('click', function(e){
    var input = e.target.previousSibling;
    if (input && input.files && input.files[0]) {
      var additional_data = input.dataset;
      delete additional_data["imageDisplayHeight"];
      delete additional_data["uploadUrl"];
    	uploadSelectedfile(input.files[0], input.dataset.uploadUrl, input.previousSibling.lastChild, additional_data);
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
 handleAllConfigurableInputs();
});

