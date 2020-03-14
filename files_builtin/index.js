$(function () {
  const $form = $('#tms-search');

  $form.on('submit', function (e) {
    e.preventDefault();

    const word = $(this).find('input[name=word]').val();
    if (word.length === 0) {
      reset();
    } else {
      search(word);
    }
  });

  const $items = $('.tms-item');

  const reset = function () {
    $items.show();
  };

  /**
   * @param {string} word
   */
  const search = function (word) {
    $.ajax({
      url: $('meta[name=APP_PATH_SEARCH]').attr('content'),
      data: {
        word: word,
      },
      dataType: 'json',
      success: render,
    });
  };

  /**
   * @param {IndexItem[]} data
   */
  const render = function (data) {
    const targets = data.map(function (item) {
      return item.notation_md5;
    });

    $items.each(function (idx, item) {
      const md5 = $(item).data('tms-item-md5');
      if (targets.indexOf(md5) >= 0) {
        $(item).show();
      } else {
        $(item).hide();
      }
    });
  };
});
