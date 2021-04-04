$(function () {
  const formControl = (() => {
    let locked = false;

    return {
      lock: () => {
        locked = true;
      },
      locking: () => {
        return locked === true;
      },
      unlock: () => {
        locked = false;
      },
    };
  })();

  const uiControl = (() => {
    const $spinner = $('#tms-search-spinner');
    const totalCount = $('#tms-items-total').text();

    return {
      beginSearch: () => {
        $spinner.removeClass('d-none');
      },
      endSearch: () => {
        $spinner.addClass('d-none');
      },
      /**
       * @param {number} [value]
       */
      updateItemCount: (value) => {
        const current = (typeof value === 'number') ? value : totalCount;

        $('#tms-items-current').text(current);
      },
    };
  })();

  const $items = $('.tms-item');

  const itemControl = (() => {
    return {
      /**
       * @param {IndexItem[]} [data]
       */
      show: (data) => {
        if (data) {
          const targets = data.map((item) => {
            return item.notation_md5;
          });

          $items.each((idx, item) => {
            const md5 = $(item).data('tms-item-md5');
            if (targets.indexOf(md5) >= 0) {
              $(item).show();
            } else {
              $(item).hide();
            }
          });
          uiControl.updateItemCount(data.length);
        } else {
          $items.show();
          uiControl.updateItemCount();
        }
      },
    };
  })();

  /**
   * @typedef {Object} FormProcessStructure
   * @property {function} before
   * @property {FormProcessMain} main
   * @property {function} after
   */

  /**
   * @callback FormProcessMain
   * @param {function} next
   */

  /**
   * @param {FormProcessStructure} structure
   */
  const formProcess = (structure) => {
    structure.before();
    structure.main(() => {
      structure.after();
    });
  };

  const $form = $('#tms-search');

  $form.on('submit', (e) => {
    e.preventDefault();

    if (formControl.locking()) {
      return;
    }

    const word = $(this).find('input[name=word]').val();
    if (word.length === 0) {
      reset();
    } else {
      search(word);
    }
  });

  const reset = () => {
    formProcess({
      before: () => {
        formControl.lock();
        uiControl.beginSearch();
      },
      main: (next) => {
        itemControl.show();
        next();
      },
      after: () => {
        uiControl.endSearch();
        formControl.unlock();
      },
    });
  };

  /**
   * @param {string} word
   */
  const search = (word) => {
    formProcess({
      before: () => {
        formControl.lock();
        uiControl.beginSearch();
      },
      main: (next) => {
        $.ajax({
          url: $('meta[name=APP_PATH_SEARCH]').attr('content'),
          data: {
            word: word,
          },
          dataType: 'json',
          success: (data) => {
            itemControl.show(data);
            next();
          },
        });
      },
      after: () => {
        uiControl.endSearch();
        formControl.unlock();
      },
    });
  };
});
