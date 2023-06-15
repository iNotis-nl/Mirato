export class Div {
  static build(classList: Array<string> | null = null, attributes: Object | null = null) {
    return Element.build('div', classList, attributes) as HTMLDivElement;
  }
}

export class Anchor {
  static build(classList: Array<string> | null = null, attributes: Object | null = null) {
    return Element.build('a', classList, attributes) as HTMLAnchorElement;
  }
}

export class Label {
  static build(classList: Array<string> | null = null, attributes: Object | null = null) {
    return Element.build('label', classList, attributes) as HTMLLabelElement;
  }
}

export class Span {
  static build(classList: Array<string> | null = null, attributes: Object | null = null) {
    return Element.build('span', classList, attributes) as HTMLLabelElement;
  }
}

export class Input {
  static build(type: string, classList: Array<string> | null = null, attributes: Object | null = null) {
    attributes = attributes ? attributes : new Object({});
    attributes = Object.assign(attributes, {'type': type});
    return Element.build('input', classList, attributes) as HTMLLabelElement;
  }
}

export class Element {
  static build(tagName: string, classList: Array<string> | null = null, attributes: Object | null = null) {
    const e = document.createElement(tagName) as HTMLElement;
    classList = classList ? classList : new Array('');
    attributes = attributes ? attributes : new Object({});
    classList.forEach(function (c) {
      if (c)
        e.classList.add(c);
    });
    Object.keys(attributes).forEach(function (n) {
      // @ts-ignore
      e.setAttribute(n, attributes[n]);
    })
    return e;
  }
}

export class CheckboxLabel {
  static build(text: string, value: string, selected: boolean = false, classList: Array<string> | null = null) {
    const id = window.Form?.createId('CheckboxLabel');
    const label = Label.build(['w-checkbox', 'form-checkbox']);
    const icon = Div.build(['w-checkbox-input', 'w-checkbox-input--inputType-custom', 'form-checkbox-icon']);
    const checkbox = Input.build('checkbox', null, {'id': id, 'style': 'opacity:0;position:absolute;z-index:-1'});
    if (selected) {
      icon.classList.add('w--redirected-checked');
      checkbox.setAttribute('checked', 'true');
    }
    const span = Span.build(['form-checkbox-label', 'w-form-label'], {'for': id});
    span.innerHTML = text;

    label.append(icon);
    label.append(checkbox);
    label.append(span);

    return label;
  }
}