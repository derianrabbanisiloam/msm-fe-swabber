import {By} from '@angular/platform-browser';
import {ComponentFixture, tick} from '@angular/core/testing';
import {DebugElement} from '@angular/core';

type OptionalString = string | null;

export function getElementBy<T>(fixture: ComponentFixture<T>, selector: string): DebugElement {
  return fixture.debugElement.query(By.css(selector));
}

export function isElementExist<T>(fixture: ComponentFixture<T>, selector: string): boolean {
  const element = fixture.debugElement.query(By.css(selector));
  return element !== undefined && element !== null;
}

export function getElementsBy<T>(fixture: ComponentFixture<T>, selector: string): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(selector));
}

export function getTotalElementsBy<T>(fixture: ComponentFixture<T>, selector: string): number {
  return getElementsBy(fixture, selector).length;
}

export function countTotalRowIn<T>(fixture: ComponentFixture<T>, tableSelector: string): number {
  fixture.whenStable();
  return fixture.debugElement.queryAll(By.css(`${tableSelector} tbody tr`)).length;
}

export function isItDisabled<T>(fixture: ComponentFixture<T>, selector: string): boolean {
  return fixture.debugElement.query(By.css(selector)).nativeElement.disabled;
}

export function isReadOnly<T>(fixture: ComponentFixture<T>, selector: string): boolean {
  return fixture.debugElement.query(By.css(selector)).nativeElement.getAttribute('readonly') != null;
}

export function areTheyDisabled<T>(fixture: ComponentFixture<T>, selector: string): boolean[] {
  return fixture.debugElement.queryAll(By.css(selector)).map(e => e.nativeElement.disabled);
}

export function getTextContent<T>(fixture: ComponentFixture<T>, selector: string): OptionalString {
  return fixture.debugElement.query(By.css(selector)).nativeElement.textContent;
}

export function getTextContents<T>(fixture: ComponentFixture<T>, selector: string): OptionalString[] {
  return fixture.debugElement.queryAll(By.css(selector))
    .map(e => e.nativeElement.textContent);
}

export function clickElementWithoutTick<T>(fixture: ComponentFixture<T>, selector: string): void {
  fixture.whenStable();
  const button = getElementBy(fixture, selector).nativeElement;
  button.click();
}

export function clickElement<T>(fixture: ComponentFixture<T>, selector: string): void {
  clickElementWithoutTick(fixture, selector);
  tick(1000);
  fixture.detectChanges();
}

export function inputTextAndChange<T>(fixture: ComponentFixture<T>, selector: string, value: string) {
  const input: HTMLInputElement = getElementBy(fixture, selector).nativeElement;
  input.focus();
  input.value = value;
  input.dispatchEvent(new Event('input'));
  input.dispatchEvent(new Event('change'));
  input.dispatchEvent(new KeyboardEvent('keyup'));
}

export function inputText<T>(fixture: ComponentFixture<T>, selector: string, value: string): void {
  fixture.whenStable();
  inputTextAndChange(fixture, selector, value);
  tick(1000);
  fixture.detectChanges();
}

export function getTextArea<T>(fixture: ComponentFixture<T>, selector: string): HTMLTextAreaElement {
  return getElementBy(fixture, selector).nativeElement;
}

export function getButton<T>(fixture: ComponentFixture<T>, selector: string): HTMLButtonElement {
  return getElementBy(fixture, selector).nativeElement;
}

export function getSelectElement<T>(fixture: ComponentFixture<T>, selector: string): HTMLSelectElement {
  return getElementBy(fixture, selector).nativeElement;
}

export function pickFromSelect<T>(fixture: ComponentFixture<T>, selector: string, index: number): void {
  const select: HTMLSelectElement = getSelectElement(fixture, selector);
  select.selectedIndex = index;
  select.dispatchEvent(new Event('change'));
  tick(1000);
  fixture.detectChanges();
}

export function inputTextArea<T>(fixture: ComponentFixture<T>, selector: string, value: string): void {
  fixture.whenStable();
  const input: HTMLTextAreaElement = getTextArea(fixture, selector);
  input.focus();
  input.value = value;
  input.dispatchEvent(new Event('input'));
  input.dispatchEvent(new Event('blur'));
  tick();
  fixture.detectChanges();
}

export function getInnerTextBy<T>(fixture: ComponentFixture<T>, selector: string): string {
  return getElementBy(fixture, selector).nativeElement.innerText;
}

export function isChecked<T>(fixture: ComponentFixture<T>, selector: string): boolean {
  const element: HTMLInputElement = getElementBy(fixture, selector).nativeElement;
  return element.checked;
}

export function getInputValue<T>(fixture: ComponentFixture<T>, selector: string): string {
  const element: HTMLInputElement = getElementBy(fixture, selector).nativeElement;
  return element.value;
}
