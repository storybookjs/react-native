<my-button>
    <button class={this.opts.rounded ? 'rounded button' : 'button'} style="color: {color}; borderColor: {color}" onClick= {handleClick } ondblclick={ handleDblclick }  class="rounded">{opts.content}<yield/>!</button>

    <script>
        this.handleClick = this.opts.handleClick || function(){}
        this.handleDblclick = this.opts.handleDblclick || function(){}
        this.color = this.opts.color || '#42b983'
    </script>

    <style>
        .rounded {
            border-radius: 5px;
        }

        .button {
            border: 3px solid;
            padding: 10px 20px;
            background-color: white;
            outline: none;
        }

    </style>
</my-button>
