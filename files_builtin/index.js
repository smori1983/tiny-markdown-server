$(function () {
  const formControl = (function () {
    let locked = false;

    return {
      lock: function () {
        locked = true;
      },
      locking: function () {
        return locked === true;
      },
      unlock: function () {
        locked = false;
      },
    };
  })();

  const $form = $('#tms-search');

  $form.on('submit', function (e) {
    e.preventDefault();

    if (formControl.locking()) {
      return;
    }

    formControl.lock();

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
    formControl.unlock();
  };

  /**
   * @param {string} word
   */
  const search = function (word) {
    startSearch();

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

    endSearch();
    formControl.unlock();
  };

  const startSearch = function () {
    $('#tms-search-spinner').removeClass('d-none');
  };

  const endSearch = function () {
    $('#tms-search-spinner').addClass('d-none');
  }
});
