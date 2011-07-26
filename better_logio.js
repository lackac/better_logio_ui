var BetterLogIo = function() {
  function ansi2html(text) {
    var openTags = 0;
    var converted = text.replace(/\[(\d\d?)m/g, function(m, code) {
      if (code === "0") {
        var closingTags = "";
        while (openTags--) closingTags += "</span>";
        return closingTags;
      } else {
        openTags += 1;
        return '<span class="ansi-'+code+'">';
      }
    });
    if (openTags > 0) {
      var closingTags = "";
      while (openTags--) closingTags += "</span>";
      converted += closingTags;
    }
    return converted;
  }

  Stream.prototype.log = function(log_file, msg) {
    if (!this._paused) {
      msg = msg.replace(/</ig,"&lt;").replace(/>/ig,"&gt;");
      msg = ansi2html(msg);
      var html = $('<p><span class="label labelcolor'
        + log_file.color + '">' + log_file.node.label + ':'
        + log_file.label + '</span> ' + msg + '</p>');
      var console = this._dom.find('.console'),
          scrollToBottom = console.scrollTop() >= console.get(0).scrollHeight - console.height() - 20;
      console.append(html);
      if (scrollToBottom) {
        console.scrollTop(console.get(0).scrollHeight - console.height());
      }
    }
    // Apply highlights if enabled
    if (this._searcher && this.highlight) {
      this._searcher.highlight(html);
      this._searcher.update_match_count();
    }
  }
}

var script = document.createElement("script");
script.type = 'text/javascript';
script.textContent = "("+BetterLogIo.toString()+")();";
document.body.appendChild(script);
