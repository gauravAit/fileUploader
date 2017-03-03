# fileUploader

To use this uploader:

Give your file type input class name = "custom-configurable-uploader";

Provide following parameters as data attribute to the input:
* uploadUrl.
* uploadFileExtension.
* imageDisplayHeight.
* Any other additional data you wish to post along with file. For example:
> userId

# example
```html
<input type="file" data-image-display-height="150px" data-upload-file-extension="png" data-upload-url="test/url" data-user-id="john_cena" class="custom-configurable-uploader" />
```
