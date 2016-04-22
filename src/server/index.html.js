import UUID from 'uuid';

export default function () {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>React Storybook</title>
        <script type="text/javascript">
          window.dataId = '${UUID.v4()}';
        </script>
        <style>
          /*
            When resizing panels, the drag event breaks if the cursor
            moves over the iframe. Add the 'dragging' class to the body
            at drag start and remove it when the drag ends.
           */
          .dragging iframe {
            pointer-events: none;
          }
          
          /* Styling the fuzzy search box placeholders */
          .searchBox::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            color: #ddd;
            font-size: 16px;
          }
          
          .searchBox::-moz-placeholder { /* Firefox 19+ */
            color: #ddd;
            font-size: 16px;
          }
          
          .searchBox:focus{
            border-color: #EEE !important;
          }
        </style>
      </head>
      <body style="margin: 0;">
        <div id="root" />
        <script src="static/admin.bundle.js"></script>
      </body>
    </html>
  `;
}
