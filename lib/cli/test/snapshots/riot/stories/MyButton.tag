<MyButton>
  <button class="buttonStyles" onClick="{ onClick }">
    <yield/>
  </button>

  <style>
    .buttonStyles {
      border: '1px solid #eee';
      border-radius: 3;
      background-color: '#FFFFFF';
      cursor: 'pointer';
      font-size: 15;
      padding: '3px 10px';
      margin: 10;
    }
  </style>

  <script>
    onClick(e){
      return (this.opts.callback ||
        (() => { console.log('clicked') })).bind(this, e)
    }
  </script>
</MyButton>
