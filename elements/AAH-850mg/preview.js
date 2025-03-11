function preview(instance, properties, context) {
    let previewDiv = $(`
          <div style="width: 100%; height: 100%; background-image: url('//meta-q.cdn.bubble.io/f1741598689371x115513862978155360/copy-to-clipboard-svgrepo-com.svg'); background-size: contain; background-repeat: no-repeat; background-position: center center; position: absolute;">
          </div>
        `);
  
    $("body").css({
      overflow: "hidden",
    });
  
    instance.canvas.append(previewDiv);
  }
  