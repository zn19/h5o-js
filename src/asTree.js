var utils = require("./utils");

function getCurrentTagName(section) {

  if (section.heading.implied) {
    return false;
  }

  var elHeading = utils.getRankingHeadingElement(section.heading);

  if (elHeading) {
    return utils.getTagName(elHeading);
  }
}

function sectionHeadingText(section) {

  if (section.heading.implied) {
    return "UNTITLED: " + utils.getTagName(section.startingNode);
  }

  var elHeading = utils.getRankingHeadingElement(section.heading);
  if (!elHeading) {
    return "ERROR: no H1-H6 inside HGROUP";
  }

  var textContent = elHeading.textContent;
  if (!textContent) {
    const byAlt = elHeading.getElementsByTagName('img')[0].getAttribute('alt');
    if (byAlt) {
      return utils.escapeHtml("ALT: " + byAlt);
    } else {
      return "EMPTY: No text content inside " + utils.getTagName(elHeading);
    }
  }

  return utils.escapeHtml(textContent);
}

function asTree(sections, index) {
  if (!sections.length) {
    return '';
  }

  var object = {};
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];

    var idx = (index) ? index + '.' + (i+1): 1;
    object[i] = {
        "index": idx,
        "title": sectionHeadingText(section),
        "tag": getCurrentTagName(section),
        "parent": utils.getTagName(section.startingNode),
        "children": asTree(section.sections, idx)
    };
  }
  return object;
}

module.exports = asTree;
