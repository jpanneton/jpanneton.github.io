---
layout: post
title: "The perfect frequency splitter debunked"
description: "A quick dive in the world of frequency splitters."
tags: [audio]
---

## Introduction

A few years ago, Multiplier posted a [video](https://www.youtube.com/watch?v=xDlZjmxWChM) on YouTube that grasped my attention quite a bit. In this video, he explains a technique that allows splitting the frequency spectrum into several bands without altering the phase of the combined output, meaning that when all the dry bands are played together, you get exactly the original signal back. Even though it's true, this technique simply doesn't work when processing the bands individually (i.e. the whole point of a frequency splitter). In fact, the higher bands contain a bunch of unwanted frequencies that are expected to be cut at the crossover points. This makes it impossible to accurately solo and process a band. Since Multiplier is quite big on YouTube and people believe what he says, I figured it would be relevant to shed some light on the subject. In this blog post, I will visually explain why it doesn't work and then offer a working solution. Note that I will only address a 2-band frequency splitter for the sake of simplicity.

## The naive frequency splitter

When implementing a frequency splitter ($n$-band), this is the first approach that usually comes to mind:

1. Create $n$ parallel chains of your signal
1. Band-pass each chain using a low pass and/or a high pass filter
1. Map the crossover frequency of the filters to some macros

The problem with this approach is that crossovers don't have a flat amplitude response when using traditional filters (usually Butterworth). In fact, the amplitude response of a Butterworth filter is -3 dB at the cutoff frequency, which adds up to +3 dB when used in a crossover.

{% include image.html path="posts/1-frequency-splitter/1-butterworth.svg" path-detail="posts/1-frequency-splitter/1-butterworth.svg" width="50%" alt="Butterworth crossover" %}

<details open="true">
  <summary>Decibel primer</summary>
  <div class="note" markdown="1">

  To understand why it's adding up to +3 dB, we must understand how decibels work. On its own, a decibel (or dB) is simply a logarithmic ratio between two values. More specifically, a 10 dB increase means that it's 10 times louder, a 20 dB increase means that it's 100 times louder, and so on (exponential). This can be calculated with the relative powers $P_1$ and $P_2$ of a sound (in watts), from which we calculate the loudness ratio $P_1 / P_2$:

  $$dB = 10 * log_{10}\left(\frac{P_1}{P_2}\right)$$

  In the physical world, dB is most often used to express sound pressure level (SPL). This is the unit used by noise level charts (e.g. "a lawnmower is 90 dB" type of chart). SPL can be calculated using the following formula, where $p$ is a sound pressure in pascals (Pa) and $p_0$ the reference sound pressure (usual $20\mu$ Pa, which is the lowest hearing threshold of a young and healthy ear):

  $$\begin{align}
  dB(SPL) = 10 * log_{10}\left(\frac{p^2}{p_0^2}\right) \\
          = 20 * log_{10}\left(\frac{p}{p_0}\right)
  \end{align}$$

  Using this formula, we can find that a sound which is twice the amplitude of the reference will yield a +6 dB SPL increment (keep that in mind for later):

  $$20 * log_{10}(2) \approx 6$$

  > "While every 6 dB SPL represents a doubling of amplitude, a non-exact rule-of-thumb is that every 10 dB increase is a doubling of perceived loudness" <cite>[Source](http://www.sengpielaudio.com/calculator-levelchange.htm)</cite>

  In the digital audio world, dB usually refers to dBFS, or decibels relative to full scale. As opposed to SPL, where 0 dB corresponds to a sound pressure level that is barely audible to the average human and higher values (positive) correspond to more loudness, dBFS measures downward. In fact, 0 dBFS corresponds to the maximum possible digital level and lower values (negative) correspond to weaker amplitudes. When a sound of more than 0 dBFS gets played back, clipping occurs. Meters in your DAW are displaying headroom (negative values) in dBFS. It can be calculated as follow, where $R$ is a normalized ratio between 0 and 1 (unlike the SPL formula):

  $$dBFS = 20 * log_{10}(R)$$

  Just like SPL, a +6 dBFS increase means that the amplitude of the signal has doubled. When using two Butterworth filters to build a crossover, the amplitude response at the crossover frequency will be -3 dB, which is the crossover point of both filters. Since they both share the same amplitude response at this specific frequency, the combined amplitude response will double. Knowing that doubling the amplitude results in a +6 dB increase (as discussed above), the combined amplitude response will be +3 dB (-3 + 6).

  </div>
</details>

## The standard frequency splitter

Nowadays, most frequency splitters are using Linkwitz–Riley filters. Unlike traditional Butterworth filters, their combined frequency response is perfectly flat when used in a crossover. They can simply be obtained by cascading two traditional Butterworth filters. By doing so, the amplitude response at the crossover frequency becomes -6 dB instead of -3 dB, which results in a combined amplitude response of 0 dB at the crossover point.

{% include image.html path="posts/1-frequency-splitter/2-linkwitz-riley.svg" path-detail="posts/1-frequency-splitter/2-linkwitz-riley.svg" width="50%" alt="Linkwitz-Riley crossover" %}

In other words, the crossover behaves like an all-pass filter, meaning that only the phase response is (smoothly) changed. When using filters with more aggressive slopes, the phase change can be heard by simply duplicating the dry frequency splitter a few times. However, in practice, this should be a non-issue for most people since processing is being applied to each band and the processing often messes with the phase itself. Also, when using a single frequency splitter at a time (general use case), this phase change can't be heard by the untrained ear.

There are a lot of people arguing online that such a phase shift will wreck your mix. Yet, most are proposing solutions such as the one discussed in this post (the Multiplier splitter), which are even worst. There are indeed some phase implications of using Linkwitz-Riley crossovers (which will be discussed in another blog post), but the consensus is that you shouldn't care. They are an industry standard and have been used for decades for this exact purpose. For mastering or phase-sensitive work, plugins will usually opt for more CPU-intensive methods such as linear phase filters to preserve phase as much as possible, as we will see later in this post.

Here are some frequency splitting VST plugins that are using Linkwitz–Riley filters:

- [ISOL8](https://www.tbproaudio.de/products/isol8) (free)
- [Gaffel](https://klevgrand.se/products/gaffel) (paid)
- [Multipass](https://kilohearts.com/products/multipass) (paid)

Here are other various plugins that are using Linkwitz–Riley filters:

- [ShaperBox](https://www.cableguys.com/shaperbox.html)
- Ableton's Multiband Dynamics

Since most low-pass and high-pass filters are Butterworth, you can also build your own Linkwitz-Riley frequency splitter by using two identical low-pass filters and two identical high-pass filters chained one after the other. You can safely assume that it works with FabFilter Pro-Q and Ableton's EQ Eight (tested). Here are some racks I made using EQ Eight:

- [Linkwitz-Riley, 24 dB slope, 2-band]({{ site.url }}/download/Frequency Splitter (LR24, 2-band).adg)
- [Linkwitz-Riley, 24 dB slope, 3-band]({{ site.url }}/download/Frequency Splitter (LR24, 3-band).adg)
- [Linkwitz-Riley, 96 dB slope, 2-band]({{ site.url }}/download/Frequency Splitter (LR96, 2-band).adg)
- [Linkwitz-Riley, 96 dB slope, 3-band]({{ site.url }}/download/Frequency Splitter (LR96, 3-band).adg)

<details open="true">
  <summary>Linkwitz-Riley design</summary>
  <div class="note" markdown="1">

  If you want to design a Linkwitz-Riley frequency splitter in your DAW, you can follow the following schemas.

  <div class="image-group">
    <div>
      <figure>
        <figcaption>2-band design</figcaption>
        {% include image.html path="posts/1-frequency-splitter/Linkwitz-Riley Splitter (2-band).svg" path-detail="posts/1-frequency-splitter/Linkwitz-Riley Splitter (2-band).svg" width="100%" alt="2-band splitter design" %}
      </figure>
    </div>
  </div>

  For 3-band frequency splitters, it gets a little more complicated. We must make sure to align the phase of each band. To do so, we must redundantly apply the filtering from other bands. The additional processing behaves just like an all-pass filter. Note that for 3+ band designs, the implementation becomes increasingly complex (as you might have guessed).

  <div class="image-group">
    <div>
      <figure>
        <figcaption>3-band design</figcaption>
        {% include image.html path="posts/1-frequency-splitter/Linkwitz-Riley Splitter (3-band).svg" path-detail="posts/1-frequency-splitter/Linkwitz-Riley Splitter (3-band).svg" width="100%" alt="3-band splitter design" %}
      </figure>
    </div>
  </div>

  Each Linkwitz-Riley filter can be designed using Butterworth filters as follow:

  {% include image.html path="posts/1-frequency-splitter/Linkwitz-Riley Butterworth.svg" path-detail="posts/1-frequency-splitter/Linkwitz-Riley Butterworth.svg" width="100%" alt="Linkwitz-Riley filter design" %}

  Regarding Butterworth filters, their order determines how steep they are, or how quickly their amplitude decreases per octave. A first-order Butterworth filter's response rolls off at −6 dB per octave. This means that a second-order filter decreases at −12 dB per octave, a third-order at −18 dB, and so on. Since Linkwitz-Riley filters are constructed by cascading two Butterworth filters of the same order, the resulting order of a Linkwitz-Riley filter will be twice the order of its underlying Butterworth.

  | Butterworth Order | Butterworth Slope | Linkwitz-Riley Order | Linkwitz-Riley Slope |
  | :---: | :---: | :---: | :---: |
  | 1 | −6 dB / octave | 2 | −12 dB / octave |
  | 2 | −12 dB / octave | 4 | −24 dB / octave |
  | 4 | −24 dB / octave | 8 | −48 dB / octave |
  | 8 | −48 dB / octave | 16 | −96 dB / octave |

  If you want to learn more about Linkwitz-Riley filters, stay tuned for my next blog post.

  </div>
</details>

## The "phase correct" frequency splitter

In his video, Multiplier demonstrated that using a naive frequency splitter was messing up the phase. As a result, he wasn't able to exactly reconstruct the original signal back. Instead, the dry frequency splitter was generating a new signal that was sounding the same as the original but had an altered phase. Then, he claimed that to fix this "issue", you could use a phase cancellation technique to perform the frequency splitting instead.

<details open="true">
  <summary>Phase primer</summary>
  <div class="note" markdown="1">

  Simply put, *phase* is the position of a point within a periodic waveform at a given time. It is usually measured in radians (or degrees), where 2π (or 360°) represents a full cycle. On its own, the absolute phase of a signal is usually irrelevant. What matters is the phase difference between two sound waves (also called *phase shift*). It's the position of a signal in time in relation to another. In fact, when adding two different sound waves, the result will highly depend on the phase difference between the two signals:

  {% include image.html path="posts/1-frequency-splitter/3-phase-interference.svg" path-detail="posts/1-frequency-splitter/3-phase-interference.svg" width="50%" alt="Phase interference" %}

  As you can see, when two identical signals get added together, fun things can happen when messing with the phase of one of them. When the signals are "in phase", the resulting signal is the sum of both (i.e. double the amplitude). This is called "constructive interference". However, when the signals are "out of phase", the resulting signal is the difference of both (i.e. null amplitude, since they are canceling each other out). This is called "destructive interference".

  Destructive interference is usually what is causing problems in your mixes and happens when some elements are canceling each other out. Here are some potential sources of destructive interference that you may face:

  - Mono downmix when the left and right channels are canceling each other out (hence the importance of mono mixing)
  - Instrument captured with two or more mics placed at different distances

  I won't go into much more detail, but this should allow you to understand how the "phase correct" frequency splitter makes clever use of destructive interference to cancel frequential information out, as you will read below.

  </div>
</details>

The gist of it is simple: instead of using a low-pass filter and a high-pass filter to build the crossover, you use either one of them on both bands, invert the phase on the second band and use the result to cancel the dry signal. In other words, you filter the first band normally, and take the remainder for the second band instead of using a crossover. In theory, it allows to extract the information that was cut out by the filter exactly, which allows to reconstruct the original dry signal back perfectly. However, in practice, it fails terribly when bands are used in isolation.

Let's suppose our signal consists of two basic sine waves of different frequencies:

<div class="image-group">
  <div>
    <figure>
      {% include image.html path="posts/1-frequency-splitter/4-low-frequency.svg" path-detail="posts/1-frequency-splitter/4-low-frequency.svg" alt="Low frequency sine" %}
      <figcaption>Low frequency</figcaption>
    </figure>
  </div>
  <div class="image-separator">
    <b>+</b>
  </div>
  <div>
    <figure>
      {% include image.html path="posts/1-frequency-splitter/5-high-frequency.svg" path-detail="posts/1-frequency-splitter/5-high-frequency.svg" alt="High frequency sine" %}
      <figcaption>High frequency</figcaption>
    </figure>
  </div>
</div>

{% include image.html path="posts/1-frequency-splitter/6-combined-signal.svg" path-detail="posts/1-frequency-splitter/6-combined-signal.svg" width="50%" alt="Combined signal" %}

Our goal is to split this signal and get the original sine waves back. To do so, we try the above logic and apply a low-pass filter to the signal. Because we are using low latency filters, we can expect the phase of the resulting sine wave to be a bit offset compared to the original. In fact, the closer the original signal is to the crossover frequency and the steeper the slope of the low-pass filter is, the worst the phase shift becomes.

{% include image.html path="posts/1-frequency-splitter/7-phase-shift.svg" path-detail="posts/1-frequency-splitter/7-phase-shift.svg" width="50%" alt="Low frequency phase shift" %}

Now, we simply need to subtract the filtered sine wave from the dry signal to recover the remainder. In theory, we should obtain the original high frequency.

<div class="image-group">
  <div>
    <figure>
      {% include image.html path="posts/1-frequency-splitter/9-phase-cancel-non-linear.svg" path-detail="posts/1-frequency-splitter/9-phase-cancel-non-linear.svg" alt="Non-linear phase cancellation result" %}
      <figcaption>Actual (non-linear phase)</figcaption>
    </figure>
  </div>
  <div>
    <figure>
      {% include image.html path="posts/1-frequency-splitter/8-phase-cancel-linear.svg" path-detail="posts/1-frequency-splitter/8-phase-cancel-linear.svg" alt="Linear phase cancellation result" %}
      <figcaption>Expected (linear phase)</figcaption>
    </figure>
  </div>
</div>

However, since the phase of the dry signal is no longer in sync with the filtered sine wave, a new frequency is introduced:

<div class="image-group">
  <div>
    <figure>
      {% include image.html path="posts/1-frequency-splitter/11-phase-cancel-error-non-linear.svg" path-detail="posts/1-frequency-splitter/11-phase-cancel-error-non-linear.svg" alt="Non-linear phase cancellation error" %}
      <figcaption>Actual (non-linear phase)</figcaption>
    </figure>
  </div>
  <div>
    <figure>
      {% include image.html path="posts/1-frequency-splitter/10-phase-cancel-error-linear.svg" path-detail="posts/1-frequency-splitter/10-phase-cancel-error-linear.svg" alt="Linear phase cancellation error" %}
      <figcaption>Expected (linear phase)</figcaption>
    </figure>
  </div>
</div>

As you can see, this "new" frequency looks quite familiar: it's a phase-shifted version of the green sine wave with a weaker amplitude. More exactly, it's the direct difference between the original green sine wave and its filtered counterpart (phase shifted).

{% include image.html path="posts/1-frequency-splitter/12-phase-shift-error.svg" path-detail="posts/1-frequency-splitter/12-phase-shift-error.svg" width="50%" alt="Phase shift error" %}

In short, this means that phase-canceled bands will always contain some of the frequencies that were used to cancel them, and their amplitude will directly depend on the filters being used (steeper filter results in a greater phase shift).

This is of course a theoretical example with only two sine waves involved, but you can see how many unwanted frequencies might be introduced in the phase canceled band of Multiplier's "phase correct" frequency splitter. This is audible and measurable just by soloing the said band. Sure, you can reconstruct the original signal that way, but the band doesn't hold the expected information in isolation, which defeats the whole purpose of using a frequency splitter to process bands independently.

Let's take a look at a white noise example. For the sake of the example, I have used Linkwitz-Riley filters (24 dB slope) to perform the filtering instead of single Butterworth filters (like in the original design). That way, expectations are more accurate, and the underlying issue is emphasized (two phase shifts instead of one).

<div class="image-group">
  <div>
    <figure>
      <figcaption>White Noise (full range)</figcaption>
      {% include image.html path="posts/1-frequency-splitter/White Noise (full).png" path-detail="posts/1-frequency-splitter/White Noise (full).png" alt="White Noise (full range)" %}
      {% include audio.html path="posts/1-frequency-splitter/White Noise (full).mp3" %}
    </figure>
  </div>
</div>

<div class="image-group">
  <div>
    <figure>
      <figcaption>Expected low pass (Linkwitz-Riley)</figcaption>
      {% include image.html path="posts/1-frequency-splitter/White Noise (low pass).png" path-detail="posts/1-frequency-splitter/White Noise (low pass).png" alt="White Noise (low pass)" %}
      {% include audio.html path="posts/1-frequency-splitter/White Noise (low pass).mp3" %}
    </figure>
  </div>
  <div>
    <figure>
      <figcaption>Expected high pass (Linkwitz-Riley)</figcaption>
      {% include image.html path="posts/1-frequency-splitter/White Noise (high pass).png" path-detail="posts/1-frequency-splitter/White Noise (high pass).png" alt="White Noise (high pass)" %}
      {% include audio.html path="posts/1-frequency-splitter/White Noise (high pass).mp3" %}
    </figure>
  </div>
</div>

<div class="image-group">
  <div>
    <figure>
      <figcaption>Actual low pass (Linkwitz-Riley)</figcaption>
      {% include image.html path="posts/1-frequency-splitter/White Noise (low pass).png" path-detail="posts/1-frequency-splitter/White Noise (low pass).png" alt="White Noise (low pass)" %}
      {% include audio.html path="posts/1-frequency-splitter/White Noise (low pass).mp3" %}
    </figure>
  </div>
  <div>
    <figure>
      <figcaption>Actual "high pass" (phase canceled)</figcaption>
      {% include image.html path="posts/1-frequency-splitter/White Noise (phase canceled).png" path-detail="posts/1-frequency-splitter/White Noise (phase canceled).png" alt="White Noise (phase canceled)" %}
      {% include audio.html path="posts/1-frequency-splitter/White Noise (phase canceled).mp3" %}
    </figure>
  </div>
</div>

As you can see (and hear), the phase canceled high band is not even remotely close to its expected counterpart. Obviously, a white noise is the worst possible case since it contains all the frequencies in the spectrum, but the result will be the same with more conventional material. Note that 

Note that a popular Max for Live device called [Invisible Band Splitter](https://www.maxforlive.com/library/device/3341/invisible-band-splitter) suffers from the same issue. It uses hardcoded 6 dB / octave slopes, which results in a very minimal phase shift, but still not in a perfectly null cancellation. This hardcoded slope is also very low and doesn't allow any sort of precise splitting (especially in the lower frequencies). So try to avoid this device as well.

## The almost perfect frequency splitter

To make the phase cancellation trick work as expected, we would need an EQ that doesn't change the phase of the signal. This is known as a *linear phase* EQ, and there are several VST plugins currently available on the market that support this feature (FabFilter Pro-Q 3, DMG EQuality, etc.). If we refer to the same figures as above, we can see that the linear phase version results in an almost null cancellation, meaning that no additional frequencies are being introduced by the process. One would think that we could maybe implement the standard Linkwitz-Riley frequency splitter using linear phase filters without any phase cancellation trick, but this is unfortunately not the case. There are a few drawbacks to keep in mind when using linear phase filters.

First, it causes pre-ringing, which is some sort of backward echo that softens the transients. Since this is not the point of this post, I won't delve into much more details (Google is your friend), but keep in mind that more aggressive filters (high slope, high Q, high latency) in the lower end of the spectrum tend to cause more pre-ringing. However, pre-ringing is usually heard when boosting (e.g. bell shape) and less when cutting (crossover). So for our use case, the impact of pre-ringing is usually minimal.

Second, it may introduce some low-frequency imprecisions when used in a low enough crossover. FabFilter Pro-Q lets you choose different processing resolutions, which result in different linear phase filter delays. The greater the delay, the better the response in the low frequencies, at the cost of more pre-ringing. The lesser the delay, the worst the response in the low frequencies, at the benefit of less pre-ringing. Steeper filters will also result in greater imprecisions. To compensate, longer delays must usually be used when low-frequency precision is paramount.

Finally, as you might have guessed, it introduces a noticeable delay. This might be fine for the final mastering stages but is often not viable in a live context where MIDI input is involved (low latency). That's why it's usually never used for individual track processing.

So, the almost perfect frequency splitter should be implemented using the proposed phase cancellation technique, but with linear phase filters (to preserve phase). The phase cancellation trick will allow to cancel out pre-ringing as well as potential low-frequency imprecisions, and the usage of linear phase filters will prevent the introduction of unwanted frequencies when canceling (as discussed above). In the end, the additional delay will be the only price to pay for such a splitter.

## Conclusion

When implementing a frequency splitter, you should seek the following solutions (in order):

1. [The standard frequency splitter](#the-standard-frequency-splitter)
    - \+ Flat amplitude response
    - \+ Simple
    - \+ Low latency
    - \+ No phase cancellation tricks
    - \+ Can be implemented using most EQs
    - \- Altered phase response
2. [The almost perfect frequency splitter](#the-almost-perfect-frequency-splitter)
    - \+ Flat amplitude response
    - \+ Flat phase response
    - \+ Reconstructs the exact input signal back
    - \- Cannot be implemented using most EQs
    - \- More complicated
    - \- Higher latency

Here are the solutions you should avoid entirely:

1. [The naive frequency splitter](#the-naive-frequency-splitter)
    - \+ Simple
    - \- Colored crossovers
    - \- Altered phase response
2. [The standard frequency splitter](#the-standard-frequency-splitter) using linear phase filters
    - \+ Flat phase response
    - \+ Simple
    - \+ No phase cancellation tricks
    - \- May introduce pre-ringing (colored crossovers)
    - \- May introduce low-frequency imprecisions (colored crossovers)
    - \- Cannot be implemented using most EQs
    - \- Higher latency
3. [The "phase correct" frequency splitter](#the-phase-correct-frequency-splitter)
    - \+ Reconstructs the exact input signal back
    - \- Doesn't work in isolation (i.e. individual bands)
    - \- More complicated

As you can see, there's not much to be gained from this clever phase cancellation trick. In practice, a standard Linkwitz-Riley frequency splitter is the way to go. It doesn't involve any phase cancellation trick, it's low latency and it works just fine. If you are working with phase-sensitive material, you could consider the phase cancellation trick (using linear phase filters exclusively) as an alternative.

*All the figures in this post have been made with [Desmos](https://www.desmos.com/calculator) and captured with [GIFsmos V](https://jpanneton.dev/gifsmos-v).*
