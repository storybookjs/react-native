<my-button>
  <button class="buttonStyles" onClick="{ onClick }">
    <yield/>
  </button>

  <style>
    .buttonStyles {
      border: solid 1px #eee;
      border-radius: 3px;
      background-color: #FFFFFF;
      cursor: pointer;
      font-size: 15px;
      padding: 3px 10px;
      margin: 10px;
    }
  </style>

  <script>
    onClick(e){
      return (this.opts.callback ||
        (() => { console.log('clicked') })).bind(this, e)
    }
  </script>
</my-button>
